/* eslint-disable @typescript-eslint/no-var-requires */
const gql = require("graphql-tag");
const graphql = require("graphql");
const AWS = require("aws-sdk");
const https = require("https");
const URL = require("url").URL;
const { print } = graphql;

const mutation = gql`mutation createMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
        id
        content
        timestamp
        messageStatus
    }
  }
  `;

const ENDPOINT_URI = process.env.API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT;
const ENDPOINT_HOST = new URL(process.env.API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT).hostname.toString();
const REGION = process.env.REGION;

/* Amplify Params - DO NOT EDIT
    API_FENSTELLA_GRAPHQLAPIENDPOINTOUTPUT
    API_FENSTELLA_GRAPHQLAPIIDOUTPUT
    API_FENSTELLA_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

exports.handler = async function(event) {
    try {
        let text = null;
        if (event.queryStringParameters != null && event.queryStringParameters.text != null && event.queryStringParameters.text.length > 0) {
            text = event.queryStringParameters.text;
        } else if (event.body != null) {
            const requestBody = JSON.parse(event.body);
            if (requestBody.text != null && requestBody.text.length > 0) {
                text = requestBody.text;
            }
        }

        if (text != null && text.length > 0) {
            const req = new AWS.HttpRequest(ENDPOINT_URI, REGION);

            req.method = "POST";
            req.path = "/graphql";
            req.headers.host = ENDPOINT_HOST;
            req.headers["Content-Type"] = "application/json";
            req.body = JSON.stringify({
                query: print(mutation),
                variables: {
                    input: {
                        content: text,
                        timestamp: new Date().valueOf(),
                        messageStatus: "NEW"
                    }
                }
            });

            const signer = new AWS.Signers.V4(req, "appsync", true);
            signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

            const data = await new Promise((resolve, reject) => {
                const httpRequest = https.request({ ...req, host: ENDPOINT_HOST }, (result) => {
                    result.on("data", (data) => {
                        resolve(JSON.parse(data.toString()));
                    });

                    result.on("error", (e) => {
                        reject(e);
                    });
                });

                httpRequest.write(req.body);
                httpRequest.end();
            });

            return {
                statusCode: 200,
                //  Uncomment below to enable CORS requests
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                body: JSON.stringify({ message: "done", body: data })
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
