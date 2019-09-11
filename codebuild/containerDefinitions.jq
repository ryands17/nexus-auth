[
  {
    "name": "ios-test",
    "image": env.IMAGE_NAME,
    "portMappings": [
      {
        "containerPort": 80,
        "hostPort": 0,
        "protocol": "tcp"
      }
    ],
    "memory": 128,
    "essential": true,
    "environment": [
      {
        "name": "PORT",
        "value": "80"
      },
      {
        "name": "APP_SECRET",
        "value": env.APP_SECRET
      },
      {
        "name": "POSTGRESQL_URL",
        "value": env.POSTGRESQL_URL
      }
    ]
  }
]
