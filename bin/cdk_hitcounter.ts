#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkHitcounterStack } from '../lib/cdk_hitcounter-stack';

const app = new cdk.App();
new CdkHitcounterStack(app, 'CdkHitcounterStack');
