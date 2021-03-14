* This is based on https://cdkworkshop.com/20-typescript.html
* Lambda function is passed downstream to a stack where it is invoked by another Lambda function
* Updates conunter in Dynamodb
* Uses TableViewer to see data in Dynamodb
* Has five different tests to check constructs
* Has Pipeline with Approval 
* Has Integration testing stage in Pipeline
* Can be used to count usage of API
* Creates REST Api using API Gateway
* Important to remember that package-lock.json needs to be ignored in .gitignore for SimpleSynthAction.standardNpmSynth to work. It expects it there.
* Has self mutating Pipeline that means pipeline can change itself if any changes are made to it.
* Only once `cdk deploy CdkWorkshopPipelineStack` needs to be deployed from commandline. After that always push changes to github and stacks will be updated all by themselves.
* When deleting stacks always remember to delete in reverse order of creation. First delete `CdkHitcounterStack` and then delete `CdkWorkshopPipelineStack` otherwise you will be stuck with a stack which can't be deleted.
