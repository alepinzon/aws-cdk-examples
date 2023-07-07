import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as sns_subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class SnsSqsLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const kmsSnsDefaultKey = kms.Alias.fromAliasName(this, 'defaultKey', 'alias/aws/sns');

    const myTopic = new sns.Topic(this, 'my-topic', {
      displayName: 'My SNS topic',
      masterKey: kmsSnsDefaultKey
      
    });

    const myQueue = new sqs.Queue(this, "my-queue", {
      visibilityTimeout: cdk.Duration.seconds(60),// It needs to be equal to or greater than the lambda timeout.
      retentionPeriod: cdk.Duration.days(14),
      encryption: sqs.QueueEncryption.SQS_MANAGED,
      dataKeyReuse: cdk.Duration.minutes(5),
      enforceSSL: true
    });

    myTopic.addSubscription(new sns_subs.SqsSubscription(myQueue,{
      rawMessageDelivery: true
    }));

    const myLambda = new NodejsFunction(this, 'my-lambda', {
      timeout: cdk.Duration.seconds(60),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, `/../src/consumer.ts`),
      reservedConcurrentExecutions: 2
    });

    myLambda.addEventSource(
      new SqsEventSource(myQueue, {
        batchSize: 1,
      }),
    );


  }
}
