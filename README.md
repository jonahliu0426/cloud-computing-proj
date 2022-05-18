# cloud-computing-proj

<img width="270" alt="mario" src="https://user-images.githubusercontent.com/90872708/168942773-007d5cc4-b529-4891-a890-e49b235980da.png"><img width="270" alt="ape" src="https://user-images.githubusercontent.com/90872708/168943365-3b5d30b7-d3aa-4639-91cc-d3f825c17a3f.png"><img width="270" alt="gallery" src="https://user-images.githubusercontent.com/90872708/168943375-9d36f603-d9f4-4008-aef8-658d3db7a4ca.png">

<img width="500" alt="transaction" src="https://user-images.githubusercontent.com/90872708/168943383-bd99bd98-93b7-4c17-b3b2-a161189fed25.png">

<img width="500" alt="image" src="https://user-images.githubusercontent.com/90872708/168940771-faff5c78-cd33-4470-b178-92a58bea0067.png">


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

<img width="469" alt="data-pipeline" src="https://user-images.githubusercontent.com/90872708/168498906-35695af9-f2e7-44d3-9ddc-809604b2b15c.png">
<p align="center"><b>Architecture</b></p>
The data pipeline uses Amazon MSK (Managed Streaming for Kafka) as the message queue, Flink as the stream computing platform, Redis as the processing results cache, and Spring Boot as the backend web service. The last three infrastructures are deployed in Amazon EC2. 

<img width="585" alt="execution-plan" src="https://user-images.githubusercontent.com/90872708/168498714-ad3d4315-809b-40f0-b495-2529eb7a90ee.png">
<p align="center"><b>Flink Execution Plan</b></p>
Flink uses Kafka as the data source and extracts the timestamp of each record, the mapped data will be sent to a sliding window with a window size of 3 hours and a window slide of 10 seconds. The operators then calculate the top ten most frequent labels in each window and sink them to Redis. 

The throughput for plain data is 2 GB per minute, but the performance of labeled data processing is limited due to the large ratio of our window size to slide size, so the processing speed is 10000 new labels per minute. Furthermore, by increasing the cluster size, this can be scaled linearly.
