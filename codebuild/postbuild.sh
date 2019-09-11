#!/bin/bash
if [ $CODEBUILD_BUILD_SUCCEEDING = 1 ]; then
  echo Pushing the Docker image...
  export IMAGE_NAME="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
  # push the docker image to ECR
  docker push $IMAGE_NAME
  export CONTAINER_DEFINITIONS="$(jq -nfc codebuild/containerDefinitions.jq)"
  # register the ECS task definition and capture the version
  export TASK_VERSION=$(aws ecs register-task-definition --family "ios-test-family" --container-definitions $CONTAINER_DEFINITIONS | jq --raw-output '.taskDefinition.revision')
  # set the ECS service desired count to 0
  aws ecs update-service --cluster "ios-test" --service "ios-test-service" --desired-count 0
  # set the ECS service desired count to 2 and assign new task definition
  aws ecs update-service --cluster "ios-test" --service "ios-test-service" --task-definition "ios-test-family:${TASK_VERSION}" --desired-count 2
else
  echo Build failed ignoring deployment
fi
