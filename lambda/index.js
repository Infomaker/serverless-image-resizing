'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Sharp = require('sharp');

exports.handler = function (event, context, callback) {
    console.log('Event was:', event)

    if (event.operation && 'ping' === event.operation) {
        callback(null, 'pong')
    }

    let contentType = 'image/jpeg' // Default
    const originalKey = event.originalKey
    const targetKey = event.targetKey
    const bucket = event.bucket
    const width = event.width ? parseInt(event.width, 10) : null
    const height = event.height ? parseInt(event.height, 10) : null

    S3.getObject({Bucket: bucket, Key: originalKey}).promise()
        .then(function (data) {
            contentType = data.ContentType
            return data
        })
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
