'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Sharp = require('sharp');

exports.handler = function (event, context, callback) {
    console.log('Event was:', event)

    const message = parseMessageSync(event)
    console.log('Input message (event) was:', message)

    const originalKey = message.originalKey
    const targetKey = message.targetKey
    const contentType = message.contentType
    const bucket = message.bucket
    const width = message.width ? parseInt(message.width, 10) : null
    const height = message.height ? parseInt(message.height, 10) : null

    S3.getObject({Bucket: bucket, Key: originalKey}).promise()
        .then(data => Sharp(data.Body)
            .limitInputPixels(0)
            .rotate()
            .resize(width, height)
            .toBuffer()
        )
        .then(buffer => S3.putObject(
            {
                Body: buffer,
                Bucket: bucket,
                ContentType: contentType,
                Key: targetKey,
            }
            ).promise()
        )
        .then(() => callback(
            null, {
                statusCode: '201',
                headers: {'location': `${bucket}/${targetKey}`},
                body: '',
            }
            )
        )
        .catch(err => callback(err))
}

let parseMessageSync = function (event) {
    if (event.Records) {
        return JSON.parse(event.Records[0].Sns.Message)
    } else {
        return event
    }
}
