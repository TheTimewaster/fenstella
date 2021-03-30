/* eslint-disable @typescript-eslint/no-var-requires */
const gql = require("graphql-tag");
const graphql = require("graphql");
const AWS = require("aws-sdk");
const https = require("https");
const URL = require("url").URL;
const { print } = graphql;

const DELTA_MILLISECONDS = 1000 * 60;
const listPublishedMessagesQuery = gql`
    query getPublishedMessage {
        listMessages(filter: {messageStatus: {eq: PUBLISHED}}, limit: 1000) {
            items {
                id
                content
                timestamp
                messageStatus
                stagingTimestamp
                publishTimestamp
                _version
                _lastChangedAt
                _deleted
            }
        }
    }
`;

const listStagedMessagesQuery = gql`
    query getStagedMessages {
        listMessages(filter: {messageStatus: {eq: STAGED}}, limit: 1000) {
            items {
                id
                content
                timestamp
                messageStatus
                stagingTimestamp
                publishTimestamp
                _version
                _lastChangedAt
                _deleted
            }
        }
    }
`;

const updateMessageMutation = gql`
    mutation operation($input: UpdateMessageInput!) {
        updateMessage(input: $input) {
            id
            content
            timestamp
            messageStatus
            stagingTimestamp
            publishTimestamp
            _version
            _lastChangedAt
            _deleted
        }
    }`;

const ENDPOINT_URI = process.env.API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT;
const ENDPOINT_HOST = new URL(process.env.API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT).hostname.toString();
const REGION = process.env.REGION;

const executeRequest = async(query, variables = undefined) => {
    const req = new AWS.HttpRequest(ENDPOINT_URI, REGION);

    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = ENDPOINT_HOST;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query,
        ...variables || variables
    });

    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

    return await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: ENDPOINT_HOST }, (result) => {
            result.on("data", (data) => {
                resolve(JSON.parse(data.toString()));
            });

            result.on("error", (e) => {
                console.error(e);
                reject(e);
            });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });
};

const getMessages = async() => {
    const publishedMessagesRequest = executeRequest(print(listPublishedMessagesQuery));
    const stagedMessagesRequest = executeRequest(print(listStagedMessagesQuery));

    return Promise.all([publishedMessagesRequest, stagedMessagesRequest])
        .then(([publishedMessagesResponse, stagedMessagesResponse]) => ({ publishedMessagesResponse, stagedMessagesResponse }));
};

const updateMessage = async(message) => {
    return await executeRequest(print(updateMessageMutation), { variables: { input: message } });
};

/* Amplify Params - DO NOT EDIT
    API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT
    API_FENSTELLA_GRAPHQLAPIIDOUTPUT
    API_FENSTELLA_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

exports.handler = async() => {
    const NOW_TIMESTAMP = new Date().valueOf();

    try {
        const { publishedMessagesResponse, stagedMessagesResponse } = await getMessages();
        let firstStagedMessage = null;
        let publishedMessage = null;

        const stagedMessages = stagedMessagesResponse.data.listMessages;
        if (stagedMessages != null && stagedMessages.items.length > 0) {
            stagedMessages.items.sort((m1, m2) => m1.stagingTimestamp <= m2.stagingTimestamp ? -1 : 1);
            firstStagedMessage = stagedMessages.items[0];

            const publishedMessages = publishedMessagesResponse.data.listMessages;
            if (publishedMessages != null && publishedMessages.items[0] != null) {
                publishedMessage = publishedMessages.items[0];

                // if the delta between the last published message and current timestamp larger than the delta then display first staged message
                const delta = NOW_TIMESTAMP - publishedMessage.publishTimestamp;
                if (delta >= DELTA_MILLISECONDS) {
                    console.log(`Updating messages. DELTA is ${delta}`);

                    const [newPublishedMessage, archivedMessage] = await Promise.all([
                        // publish message
                        updateMessage({
                            id: firstStagedMessage.id,
                            _version: firstStagedMessage._version,
                            publishTimestamp: NOW_TIMESTAMP,
                            messageStatus: "PUBLISHED"
                        }),
                        // move published message to archived
                        updateMessage({
                            id: publishedMessage.id,
                            _version: publishedMessage._version,
                            messageStatus: "ARCHIVED"
                        })
                    ]);

                    return {
                        statusCode: 200,
                        body: { message: "done", newPublishedMessage, archivedMessage }
                    };
                }
            } else {
                // publish message
                const newPublishedMessage = await updateMessage({
                    id: firstStagedMessage.id,
                    _version: firstStagedMessage._version,
                    publishTimestamp: NOW_TIMESTAMP,
                    messageStatus: "PUBLISHED"
                });

                return {
                    statusCode: 200,
                    body: { message: "done", newPublishedMessage }
                };
            }
        }

        return {
            statusCode: 200,
            body: { message: "no changes" }
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: { message: "error while set display of message", reason: error.message }
        };
    }
};
