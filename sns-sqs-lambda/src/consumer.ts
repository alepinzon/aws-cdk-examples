import { SQSEvent } from "aws-lambda";


export const handler = async (event: SQSEvent, context: any = {}): Promise<any> => {

    console.info('-------- SQS Consumer Handler --------');
    console.info(event);

    for (const record of event.Records) {
        console.info('SQS record:', record?.body);
    }
};