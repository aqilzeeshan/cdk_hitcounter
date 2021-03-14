import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
export interface HitCounterProps {
    /** the function for which we want to count url hits **/
    downstream: lambda.IFunction;
    /**
     * The read capacity units for the table
     *
     * Must be greater than 5 and lower than 20
     *
     * @default 5
     */
    readCapacity?: number;
}
export declare class HitCounter extends cdk.Construct {
    /** allows accessing the counter function */
    readonly handler: lambda.Function;
    /** the hit counter table */
    readonly table: dynamodb.Table;
    constructor(scope: cdk.Construct, id: string, props: HitCounterProps);
}
