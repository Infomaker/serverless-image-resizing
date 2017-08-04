# Serverless Image Resizing

## Description

Resizes images on the fly using Amazon S3 and AWS Lambda.

## Install

**Note:** If you create the Lambda function yourself, make sure to select Node.js version 6.10.

1. Build the Lambda function

   The Lambda function uses [sharp][sharp] for image resizing which requires native extensions. In order to run on Lambda, it must be packaged on Amazon Linux. You can accomplish this in one of two ways:

   - Upload the contents of the `lambda` subdirectory to a [Amazon EC2 instance running Amazon Linux][amazon-linux] and run `npm install`, or

   - Use the Amazon Linux Docker container image to build the package using your local system. This repo includes Makefile that will download Amazon Linux, install Node.js and developer tools, and build the extensions using Docker. Run `make all` and then `make dist` which will create a zip file in the `dist` dir.

1. Deploy the CloudFormation stack

  Run `bin/deploy` to deploy the CloudFormation stack. It will create a temporary Amazon S3 bucket, package and upload the function, and create the Lambda function, Amazon API Gateway RestApi, and an S3 bucket for images via CloudFormation.

  The deployment script requires the [AWS CLI][cli] version 1.11.19 or newer to be installed.
  
## Usage

If parameter `operation="ping"` is supplied, service will respond with "pong".

Normal event for service:
```
originalKey     The S3 object key for the original image to resize.
targetKey       The S3 object key for the transformed image.
bucket          The S3 bucket in wich the original and target S3 objects will reside.
width           The width (in pixels) the service will use.
height          The height (in pixels) the service will use.
```

## License

This code is [licensed][license] under Apache 2.0.

[license]: LICENSE
[sharp]: https://github.com/lovell/sharp
[amazon-linux]: https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/
[cli]: https://aws.amazon.com/cli/

```
Copyright 2017 Infomaker Scandinavia AB

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
``
