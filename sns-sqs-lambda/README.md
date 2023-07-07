# CDK TypeScript project

This is a cdk project, which creates an sns topic, sqs queue and a lambda and subcribe the sqs queue as topic subscriber, and the lambda is configured as sqs queue consumer.

For the sns topic and the sqs queue is enable the aws managed encryption keys.


## ChatGPT description about this Architecture

Moving SNS notifications to an SQS (Simple Queue Service) queue and then consuming the events with a Lambda function can provide several benefits in certain scenarios:

Asynchronous Processing: Using an SQS queue decouples the producer (SNS) from the consumer (Lambda function). This asynchronous processing model allows the Lambda function to consume events from the queue at its own pace, independent of the rate at which events are published to the SNS topic. This can help in managing bursty workloads or spikes in event traffic.

Message Persistence: SQS provides durable message storage. When an event is published to an SQS queue, it is stored reliably until it is consumed and deleted by a consumer. This ensures that no events are lost even if the consumer (Lambda function) is temporarily unavailable or experiencing errors. It provides an additional layer of reliability and fault tolerance.

Retries and Error Handling: With an SQS queue, if a Lambda function fails to process an event, the message remains in the queue and can be retried automatically based on the configured retry policy. This helps in handling temporary failures or transient errors. Additionally, if the Lambda function encounters a fatal error, the message can be moved to a dead-letter queue (DLQ) for further analysis and troubleshooting.

Increased Concurrency and Parallelism: When using an SQS queue, multiple instances of a Lambda function can be triggered to consume messages in parallel from the queue. This allows for increased concurrency and parallelism, enabling efficient utilization of compute resources and faster processing of messages.

Fan-out and Fan-in: Using an SQS queue as an intermediate layer between SNS and Lambda enables fan-out and fan-in patterns. Multiple Lambda functions can subscribe to the same SQS queue, allowing for parallel processing of events by different functions. Additionally, the output of these functions can be aggregated or processed further before sending it to another destination.

Backpressure and Throttling: If the number of events published to the SNS topic exceeds the rate at which the Lambda function can consume them, the SQS queue acts as a buffer and applies backpressure. This helps in managing event spikes and prevents overwhelming the consumer function. The consumer can process messages from the queue at a pace that it can handle, reducing the risk of throttling or event loss.

Overall, using SQS as an intermediate layer between SNS and Lambda provides flexibility, durability, fault tolerance, and scalability in event-driven architectures. It enables asynchronous processing, decoupling of components, and efficient handling of event traffic, leading to more robust and scalable systems.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
