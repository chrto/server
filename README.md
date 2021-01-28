# System4u Intune Device Onboarding Tool API server

## Install
Create `.env` file from template
    $ cp .env-tmp .env

Install project dependencies
    $ npm install

## Environment Variables

Project can be customized using ENV variables:
|-----------------------------|-------------------------------------------------------------------|-------------------------------------------------|
| Variable                    | Default                                                           | Description                                     |
|-----------------------------|-------------------------------------------------------------------|-------------------------------------------------|
| `API_PORT`                  | 8000                                                              | Port to run the service on                      |
| `SHUTDOWN_PORT`             | 8001                                                              | Port on which we listen for graceful shutdown   |
| `SHUTDOWN_TIMEOUT`          | 2000                                                              | (ms)                                            |
|                             |                                                                   |                                                 |
| `SSO_ISSUER`                | `https://login.microsoftonline.com/{common}/v2.0`                 |                                                 |
| `SSO_JWKS_URI`              | `https://login.microsoftonline.com/{common}/discovery/v2.0/keys`  |                                                 |
| `SSO_TOKEN_ENDPOINT`        | `https://login.microsoftonline.com/{common}/oauth2/v2.0/token`    |                                                 |
| `SSO_END_SESSION_ENDPOINT`  | `https://login.microsoftonline.com/{common}/oauth2/v2.0/logout`   |                                                 |
| `SSO_CLIENT_ID`             |                                                                   |                                                 |
| `SSO_CLIENT_SECRET`         |                                                                   |                                                 |
| `SSO_REDIRECT_URI`          |                                                                   |                                                 |
| `SSO_HASH_ALG`              |                                                                   |                                                 |
|-----------------------------|-------------------------------------------------------------------|-------------------------------------------------|

## Run API server in development mode
    $ npm run dev

## Run unit test in jest
    $ npm run test

## Stop API server
    $ npm run stop-safe

## Run API in Docker
    $ npm run docker:start:api

## Stop API in Docker
    $ npm run docker:stop:api

## View container logs
    $ docker logs swagger-ui

## Backend Services

We use several backend services for development

|----------------------------------|----------------|------------------------------------------|
| Url                              | Service        | Description                              |
|----------------------------------|----------------|------------------------------------------|
| [localhost:8103](localhost:8103) | Swagger UI     | Swagger editor                           |
|----------------------------------|----------------|------------------------------------------|

## Documentation

Documetation is in OpenAPI 3.0 format and it resides in [index.yaml](./docs/api/index.yaml). You can use provided swagger-ui running on [localhost:8103](http://localhost:8103).

## **General**

The following status codes can be sent in the response to any request:

* 400 - Bad request: the body consists of one single JSON object with a "message" field containing an error code
* 401 - Unauthorized: despite the name, this error means the user (request) is not authenticated (should re-login)
* 403 - Forbidden: e.g. the real unauthorized - the user (request) has no permission to the requested resource (special case of bad request)
* 404 - Not found: as indicated by its name...
* 405 - Method Not Allowed: as indicated by its name...
* 409 - Conflict: as indicated by its name...
* 500 - Internal Server Error: as indicated by its name...
