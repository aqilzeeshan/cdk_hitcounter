import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import * as lambda from '@aws-cdk/aws-lambda';

import { HitCounter }  from '../lib/hitcounter';

//This test is simply testing to ensure that the synthesized stack includes a DynamoDB table.
test('DynamoDB Table Created', () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream:  new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromInline('test')
    })
  });
  // THEN
  expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
});

//Test for the Lambda function
test('Lambda Has Environment Variables', () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream:  new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromInline('test')
    })
  });
  // THEN
  expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
    Environment: {
      Variables: {
        /*
        https://cdkworkshop.com/20-typescript/70-advanced-topics/100-construct-testing/1000-assertion-test.html
        First run with the following. Test will fail and you will get the values which you need to use
        DOWNSTREAM_FUNCTION_NAME: "TestFunction",
        HITS_TABLE_NAME: "MyTestConstructHits"
        */
        DOWNSTREAM_FUNCTION_NAME: {"Ref": "TestFunction22AD90FC"},
        HITS_TABLE_NAME: {"Ref": "MyTestConstructHits24A357F0"}
      }
    }
  }));
});

test('DynamoDB Table Created With Encryption', () => {
  const stack = new cdk.Stack();
  // WHEN
  new HitCounter(stack, 'MyTestConstruct', {
    downstream:  new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromInline('test')
    })
  });
  // THEN
  expectCDK(stack).to(haveResource('AWS::DynamoDB::Table', {
    SSESpecification: {
      SSEEnabled: true
    }
  }));
});

test('read capacity can be configured', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new HitCounter(stack, 'MyTestConstruct', {
      downstream:  new lambda.Function(stack, 'TestFunction', {
        runtime: lambda.Runtime.NODEJS_10_X,
        handler: 'lambda.handler',
        code: lambda.Code.fromInline('test')
      }),
      readCapacity: 3
    });
  }).toThrowError(/readCapacity must be greater than 5 and lower than 20/);
});



