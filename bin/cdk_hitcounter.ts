#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkHitcounterStack } from '../lib/cdk_hitcounter-stack';
import { WorkshopPipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
new WorkshopPipelineStack(app, 'CdkWorkshopPipelineStack');
new CdkHitcounterStack(app, 'CdkHitcounterStack');
