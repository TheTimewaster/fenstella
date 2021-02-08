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
                                "allow": "private",
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
                "DISPLAY",
                "DENIED"
            ]
        }
    },
    "nonModels": {},
    "version": "39036d150a12682e9d897388faa88d88"
};