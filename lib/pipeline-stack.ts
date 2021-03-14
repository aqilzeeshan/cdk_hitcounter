import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { ShellScriptAction, SimpleSynthAction, CdkPipeline } from "@aws-cdk/pipelines";
import { StringParameter } from '@aws-cdk/aws-ssm';
import { ManualApprovalAction } from '@aws-cdk/aws-codepipeline-actions';
import { WorkshopPipelineStage } from './pipeline-stage';

export class WorkshopPipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Pipeline code goes here
        // Defines the artifact representing the sourcecode
        const sourceArtifact = new codepipeline.Artifact(); 
        // Defines the artifact representing the cloud assembly 
        // (cloudformation template + all other assets)
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        const githubOwner = StringParameter.fromStringParameterAttributes(this, 'gitOwner',{
            parameterName: 'devhour-backend-git-owner'
          }).stringValue;
        
        const githubBranch = StringParameter.fromStringParameterAttributes(this, 'gitBranch',{
            parameterName: 'devhour-backend-git-branch'
          }).stringValue;

        // The basic pipeline declaration. This sets the initial structure
        // of our pipeline
        const pipeline = new CdkPipeline(this, 'Pipeline', {
            pipelineName: 'WorkshopPipeline',
            crossAccountKeys: false,
            cloudAssemblyArtifact,

            // Generates the source artifact from the repo we created in the last step
            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: cdk.SecretValue.secretsManager('NewFullAccessToken', {jsonField: 'NewFullAccessToken'}), // this token is stored in Secret Manager
                owner: githubOwner,
                repo: 'cdk_hitcounter',
                branch: githubBranch
            }),
            // Builds our source code outlined above into a could assembly artifact
            synthAction: SimpleSynthAction.standardNpmSynth({
                sourceArtifact, // Where to get source code to build
                cloudAssemblyArtifact, // Where to place built source
                buildCommand: 'npm run build', // Language-specific build cmd
            })
        });

        const deploy = new WorkshopPipelineStage(this, 'Deploy');
        const deployStage = pipeline.addApplicationStage(deploy);

        deployStage.addActions(new ManualApprovalAction({
            actionName: 'ManualApproval',
            runOrder: deployStage.nextSequentialRunOrder(),
        }));

        deployStage.addActions(new ShellScriptAction({
            actionName: 'TestViewerEndpoint',
            useOutputs: {
                ENDPOINT_URL: pipeline.stackOutput(deploy.hcViewerUrl)
            },
            commands: [
                'curl -Ssf $ENDPOINT_URL'
            ]
        }));
        deployStage.addActions(new ShellScriptAction({
            actionName: 'TestAPIGatewayEndpoint',
            useOutputs: {
                ENDPOINT_URL: pipeline.stackOutput(deploy.hcEndpoint)
            },
            commands: [
                'curl -Ssf $ENDPOINT_URL/',
                'curl -Ssf $ENDPOINT_URL/hello',
                'curl -Ssf $ENDPOINT_URL/test'
            ]
        }));

    }
}
