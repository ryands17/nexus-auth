#!/bin/bash
if [ $CODEBUILD_BUILD_SUCCEEDING = 1 ]; then
  echo Pushing the Docker image...
  export IMAGE_NAME="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}:${IMAGE_TAG}"
  # push the docker image to ECR
  docker push $IMAGE_NAME
  export CONTAINER_DEFINITIONS="$(jq -nfc codebuild/containerDefinitions.jq)"
  # register the ECS task definition and capture the version
  export TASK_VERSION=$(aws ecs register-task-definition --family $IMAGE_NAME --container-definitions $CONTAINER_DEFINITIONS | jq --raw-output '.taskDefinition.revision')
  # set the ECS service desired count to 0 (for the old task definition)
  aws ecs update-service --cluster $IMAGE_NAME --service $IMAGE_NAME --desired-count 0
  # set the ECS service desired count to 2 and assign a new task definition
  aws ecs update-service --cluster $IMAGE_NAME --service $IMAGE_NAME --task-definition "$IMAGE_NAME:${TASK_VERSION}" --desired-count 2
else
  echo Build failed ignoring deployment
fi
