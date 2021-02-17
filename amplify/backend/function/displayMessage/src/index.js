/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

const DISTANCE_MILLISECONDS = 1000 * 60;
const NOW_TIMESTAMP = new Date().valueOf();

const listPublishedMessagesQuery = gql`
    query getPublishedMessage {
        listMessages(filter: {messageStatus: {eq: PUBLISHED}}) {
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
        listMessages(filter: {messageStatus: {eq: STAGED}}) {
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

const executeRequest = async(query, variables = undefined) => {
    return await axios({
        url: process.env.API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT,
        method: "post",
        headers: {
            "x-api-key": process.env.API_FENSTELLA_GRAPHQLAPIKEYOUTPUT
        },
        data: {
            query,
            ...variables || variables
        }
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
    try {
        const { publishedMessagesResponse, stagedMessagesResponse } = await getMessages();
        let firstStagedMessage = null;
        let publishedMessage = null;

        const stagedMessages = stagedMessagesResponse.data.data.listMessages;
        if (stagedMessages != null && stagedMessages.items.length > 0) {
            stagedMessages.items.sort((m1, m2) => m1.stagingTimestamp > m2.stagingTimestamp ? -1 : 1);
            firstStagedMessage = stagedMessages.items[0];

            const publishedMessages = publishedMessagesResponse.data.data.listMessages;
            if (publishedMessages != null && publishedMessages.items[0] != null) {
                publishedMessage = publishedMessages.items[0];

                // if the distance between the last published message and current timestamp larger than the delta then display first staged message
                const delta = NOW_TIMESTAMP - publishedMessage.publishTimestamp;
                if (delta >= DISTANCE_MILLISECONDS) {
                    console.log(`Updating messages now. DELTA is ${delta}`);
                    // publish message
                    await updateMessage({
                        id: firstStagedMessage.id,
                        _version: firstStagedMessage._version,
                        publishTimestamp: NOW_TIMESTAMP,
                        messageStatus: "PUBLISHED"
                    });

                    // move published message to archived
                    await updateMessage({
                        id: publishedMessage.id,
                        _version: publishedMessage._version,
                        messageStatus: "ARCHIVED"
                    });
                }
            } else {
                // publish message
                await updateMessage({
                    id: firstStagedMessage.id,
                    _version: firstStagedMessage._version,
                    publishTimestamp: NOW_TIMESTAMP,
                    messageStatus: "PUBLISHED"
                });
            }
        }

        return {
            statusCode: 200,
            body: { message: "done", firstStagedMessage, publishedMessage }
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: { message: "error while set display of message", reason: error.message }
        };
    }
};
