# cloud-computing-proj

## Data Pipeline
### Architecture
<img src="data-pipeline/image/pipeline-architecture.png" width="350">

The data pipeline uses Amazon MSK (Managed Apache Kafka) as the message queue, Flink as the stream computing platform, Redis as the processing results cache, and Spring Boot as the backend web service. The last three infrastructures are deployed in Amazon EC2. 
### API
* `GET http://34.205.71.184:8080/api/etl/tag/{tag-name}`: add a new tag with `tag-name`.
* `GET http://34.205.71.184:8080/api/etl/top-tags`: get the top-10 tags (during the previous hour, update every ten seconds). 

## User Database
### Architecture
<img />


The user database uses AWS RDS Aurora Postgres as the database clusters, connected Hasura Cloud as GraphQL API Engine provider, since Most of the data query of this project is written in GraphQL and Hasura provides an easy and convenient interface to handle the API call in a scalable way.

All the relational tables are created, defined, and managed via Hasura Cloud, which modify the data to the actual instance on AWS RDS. 
the exact step of building Hasura Cloud with AWS RDS Aurora Postgres can be found here: https://hasura.io/docs/latest/graphql/cloud/getting-started/cloud-databases/aws-aurora/

## Authentication

## User Post

User Posts 

## Connect Wallet
