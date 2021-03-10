# API server

## Install
Install project dependencies

```
    $ npm install
```
Create sqlite database and seed with data
```
    $ npm run create:db  
```
Create `.env` file from template
```
    $ cp .env.temp .env
```
## Environment Variables

Project can be customized using ENV variables:
| Variable                    | Default                                                                   | Description                                     |
|-----------------------------|---------------------------------------------------------------------------|-------------------------------------------------|
| API_PORT                    | 8000                                                                      | Port to run the service on                      |
| SHUTDOWN_PORT               | 8001                                                                      | Port on which we listen for graceful shutdown   |
| SHUTDOWN_TIMEOUT            | 2000                                                                      | (ms)                                            |
| STARTUP_DELAY               | 1000                                                                      | (ms)                                            |
| RETRY_COUNT                 | 10                                                                        |                                                 |
|                             |                                                                           |                                                 |
| SSO_ISSUER                  | http://localhost:8101/auth/realms/demo                                    |                                                 |
| SSO_WELL_KNOWN              | http://localhost:8101/auth/realms/demo/.well-known/openid-configuration   |                                                 |
| SSO_JWKS_URI                | http://localhost:8101/auth/realms/demo/protocol/openid-connect/certs      |                                                 |
| SSO_TOKEN_ENDPOINT          | http://localhost:8101/auth/realms/demo/protocol/openid-connect/token      |                                                 |
| SSO_END_SESSION_ENDPOINT    | http://localhost:8101/auth/realms/demo/protocol/openid-connect/logout     |                                                 |
| SSO_CLIENT_ID               | server                                                                    |                                                 |
| SSO_CLIENT_SECRET           | 155bca8c-5c95-4f40-a084-8f0025b0456b                                      |                                                 |
| SSO_REDIRECT_URI            | http://localhost:8080/callback                                            |                                                 |
| SSO_HASH_ALG                | RS256                                                                     |                                                 |
|                             |                                                                           |                                                 |
| KEYCLOAK_USER               | admin                                                                     | Keycloak admin user                             |
| KEYCLOAK_PASSWORD           | Admin-123                                                                 | Keycloak admin passwd                           |
|                             |                                                                           |                                                 |
| LOG_LABEL                   | SERVER                                                                    | Log entry preffix                               |
| LOG_DIR                     | ./logs                                                                    |                                                 |
| LOG_FILE_LEVEL              | debug                                                                     | Log level for file log                          |
| LOG_FILE_NAME_INFO          | info-%DATE%.log                                                           | Log file name                                   |
| LOG_FILE_NAME_ERROR         | error-%DATE%.log                                                          | Error log file name                             |
| LOG_FILE_DATE_PATTERN       | YYYY-MM-DD                                                                | Daily log rotation                              |
| LOG_FILE_ZIP_ARCH           | true                                                                      | Archive old logs                                |
| LOG_FILE_MAX_SIZE           | 10m                                                                       | Max file size is 10 MB                          |
| LOG_FILE_MAX_FILES          | 14d                                                                       | Keep logs for 14 days                           |
| LOG_CONSOLE_LEVEL           | debug                                                                     | Log level for console log                       |
| LOG_CONSOLE_ENABLE          | true                                                                      | Enable console log                              |
| LOG_SPLUNK_ENABLE           | false                                                                     | Enable log into splunk                          |
| LOG_SPLUNK_LEVEL            | info                                                                      | Log level for splunk                            |
| LOG_SPLUNK_PROTOCOL         | https                                                                     | Protocol to use                                 |
| LOG_SPLUNK_HOST             | localhost                                                                 | Splunk HTTP Event Collector host                |
| LOG_SPLUNK_PORT             | 8088                                                                      | Splunk HTTP Event Collector port                |
| LOG_SPLUNK_PATH             | /services/collector/event/1.0                                             | URL path to use                                 |
| LOG_SPLUNK_INDEX            | main                                                                      | Index for the events sent to Splunk             |
| LOG_SPLUNK_SOURCE           | winston                                                                   | Source for the events sent to Splunk            |
| LOG_SPLUNK_SOURCE_TYPE      | winston-splunk-logger                                                     | Sourcetype for the events sent to Splunk        |
| LOG_SPLUNK_TOKEN            |                                                                           | Splunk HTTP Event Collector token               |
|                             |                                                                           |                                                 |
| SPLUNK_PASSWORD             |                                                                           | Default password of the admin user              |
|                             |                                                                           |                                                 |

## Run server in development mode
```
    $ npm run start:dev
```
## Stop server
```
    $ npm run stop:server
```
## Run server in Docker
```
    $ npm run docker:start:api
```
## Stop server in Docker
```
    $ npm run docker:stop:api
```
## Run unit test in jest
```
    $ npm run test
```
or
```
    $ npm run test:watch
```
## Run dev environment in docker
```
    $ npm run docker:compose:up:dev
```
## Run splunk in docker
```
    $ npm run docker:splunk
```
## Stop dev environment in docker
```
    $ npm run docker:compose:down
```
## Backend Services

We use several backend services for development

| Url                                     | Service        | Description                              |
|-----------------------------------------|----------------|------------------------------------------|
| [localhost:8103](http://localhost:8103) | Swagger UI     | Swagger editor                           |
| [localhost:8101](http://localhost:8101) | Keycloak       | Keycloak SSO Issuer                      |
| [localhost:8104](http://localhost:8104) | Splunk         | Splunk Enterprise                        |

Keycloak is used as identity manager for development purpose. There is configured default client whit id `server` and secret `155bca8c-5c95-4f40-a084-8f0025b0456b`. You can login to administration console with account `admin/Admin-123`. You can change this settings in `.env` file, which is in project root derectory. 
There are registered two default users in Keycloak. You can change them in `./dockers/sso/realm-demo.json` file, or in administration console.
 - admin.adminovic@company.com/Adminovic-123 (as Admin)
 - joe.doe@company.com/Doe-123 (as User)
## Documentation

Documetation is in OpenAPI 3.0 format and it resides in [index.yaml](./docs/api/index.yaml). You can use provided swagger-ui running on [localhost:8103](http://localhost:8103).

### General

The following status codes can be sent in the response to any request:

* 400 - Bad request: the body consists of one single JSON object with a "message" field containing an error code
* 401 - Unauthorized: despite the name, this error means the user (request) is not authenticated (should re-login)
* 403 - Forbidden: e.g. the real unauthorized - the user (request) has no permission to the requested resource (special case of bad request)
* 404 - Not found: as indicated by its name...
* 405 - Method Not Allowed: as indicated by its name...
* 409 - Conflict: as indicated by its name...
* 500 - Internal Server Error: as indicated by its name...
