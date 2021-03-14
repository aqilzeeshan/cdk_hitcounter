import { CdkHitcounterStack } from './cdk_hitcounter-stack';
import { Stage, CfnOutput, Construct, StageProps } from '@aws-cdk/core';

export class WorkshopPipelineStage extends Stage {
    public readonly hcViewerUrl: CfnOutput; 
    public readonly hcEndpoint: CfnOutput; 

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const service = new CdkHitcounterStack(this, 'WebService');

        this.hcEndpoint = service.hcEndpoint;
        this.hcViewerUrl = service.hcViewerUrl;
    }
}
