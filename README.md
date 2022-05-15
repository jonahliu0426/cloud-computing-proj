# cloud-computing-proj

## User Database
### Architecture
<img src="hasura-aws-rds/hasura-aws-rds-architecture.jpg" width="350">


The user database uses AWS RDS Aurora Postgres as the database clusters, connected Hasura Cloud as GraphQL API Engine provider, since Most of the data query of this project is written in GraphQL and Hasura provides an easy and convenient interface to handle the API call in a scalable way.

All the relational tables are created, defined, and managed via Hasura Cloud, which modify the data to the actual instance on AWS RDS. 
the exact step of building Hasura Cloud with AWS RDS Aurora Postgres can be found here: https://hasura.io/docs/latest/graphql/cloud/getting-started/cloud-databases/aws-aurora/

## Authentication
<img src="amplify-service/amplify-service-architecture.jpg" width="350">

User Authorization and Authentication uses Amazon Cognito managed by AWS Amplify

## Upload, Search, and Index Post
<img src="upload-search-index-photos/upload-search-index-photos-architecture.jpg" width="350">

User Posts 

## Connect Wallet

## Data Pipeline
### Architecture
<img src="data-pipeline/image/pipeline-architecture.png" width="350">

The data pipeline uses Amazon MSK (Managed Apache Kafka) as the message queue, Flink as the stream computing platform, Redis as the processing results cache, and Spring Boot as the backend web service. The last three infrastructures are deployed in Amazon EC2. 

## Simulated Trading
<img width="437" alt="trading-architecture" src="https://user-images.githubusercontent.com/90872708/168488593-053f04d9-bb57-48f9-b108-fb10897c0845.png">

