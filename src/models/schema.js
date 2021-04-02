export const schema = {
    "models": {
        "Message": {
            "name": "Message",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "content": {
                    "name": "content",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "timestamp": {
                    "name": "timestamp",
                    "isArray": false,
                    "type": "AWSTimestamp",
                    "isRequired": true,
                    "attributes": []
                },
                "messageStatus": {
                    "name": "messageStatus",
                    "isArray": false,
                    "type": {
                        "enum": "MessageStatus"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "stagingTimestamp": {
                    "name": "stagingTimestamp",
                    "isArray": false,
                    "type": "AWSTimestamp",
                    "isRequired": false,
                    "attributes": []
                },
                "publishTimestamp": {
                    "name": "publishTimestamp",
                    "isArray": false,
                    "type": "AWSTimestamp",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Messages",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "byPublishTimestamp",
                        "fields": [
                            "timestamp",
                            "publishTimestamp"
                        ],
                        "queryField": "messagesByPublishtimestamp"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "read"
                                ],
                                "provider": "apiKey"
                            },
                            {
                                "allow": "public",
                                "operations": [
                                    "read",
                                    "create",
                                    "update",
                                    "delete"
                                ],
                                "provider": "iam"
                            }
                        ]
                    }
                }
            ]
        }
    },
    "enums": {
        "MessageStatus": {
            "name": "MessageStatus",
            "values": [
                "NEW",
                "STAGED",
                "PUBLISHED",
                "DENIED",
                "ARCHIVED",
                "DISPLAY"
            ]
        }
    },
    "nonModels": {},
    "version": "3834e566383bd5eee9293e8c71c1c695"
};