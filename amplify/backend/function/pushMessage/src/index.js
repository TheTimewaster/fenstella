/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

const mutation = gql`
    mutation createMessage($input: CreateMessageInput!) {
        createMessage(input: $input) {
            id
            content
            timestamp
            messageStatus
            _version
            _lastChangedAt
            _deleted
        }
    }
  `;

/* Amplify Params - DO NOT EDIT
    API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT
    API_FENSTELLA_GRAPHQLAPIIDOUTPUT
    API_FENSTELLA_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

exports.handler = async function(event) {
    try {
        const requestBody = JSON.parse(event.body);
        if (requestBody.text != null && requestBody.text.length > 0) {
            const response = await axios({
                url: process.env.API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT,
                method: "post",
                headers: {
                    "x-api-key": process.env.API_FENSTELLA_GRAPHQLAPIKEYOUTPUT
                },
                data: {
                    query: print(mutation),
                    variables: {
                        input: {
                            content: requestBody.text,
                            timestamp: new Date().valueOf(),
                            messageStatus: "NEW"
                        }
                    }
                }
            });

            return {
                statusCode: 200,
                //  Uncomment below to enable CORS requests
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                body: JSON.stringify({ message: "done", body: response.data })
            };
        }

        return {
            statusCode: 400,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify({ message: "no text provided" })
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: {
                message: "error while creating message",
                reason: error.message
            }
        };
    }
};
