'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Sharp = require('sharp');

const BUCKET = process.env.BUCKET;

exports.handler = function (event, context, callback)
{
    const originalKey = event.originalKey
    const targetKey = event.targetKey
    const contentType = event.contentType
    const width = event.width ? parseInt(event.width, 10) : null
    const height = event.height ? parseInt(event.height, 10) : null

    S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
            .then(data => Sharp(data.Body)
                    .limitInputPixels(0)
                    .rotate()
                    .resize(width, height)
                    .toBuffer()
            )
            .then(buffer => S3.putObject(
                    {
                        Body: buffer,
                        Bucket: BUCKET,
                        ContentType: contentType,
                        Key: targetKey,
                    }
                  ).promise()
            )
            .then(() => callback(
                    null, {
                        statusCode: '201',
                        headers: {'location': `${BUCKET}/${targetKey}`},
                        body: '',
                    }
                  )
            )
            .catch(err => callback(err))
}
