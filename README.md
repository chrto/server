# API server

## Install
Create `.env` file from template
```
    $ cp .env-tmp .env
```
Install project dependencies

```
    $ npm install
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
| SSO_CLIENT_SECRET           |                                                                           |                                                 |
| SSO_REDIRECT_URI            | http://localhost:8080/callback                                            |                                                 |
| SSO_HASH_ALG                | RS256                                                                     |                                                 |
|                             |                                                                           |                                                 |
| KEYCLOAK_USER               |                                                                           | Keycloak admin user                             |
| KEYCLOAK_PASSWORD           |                                                                           | Keycloak admin passwd                           |

## Run server in development mode
```
    $ npm run start:dev
```
## Run unit test in jest
```
    $ npm run test
```
or
```
    $ npm run test:watch
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
## Run dev environment in docker
```
    $ npm run docker:compose:up:dev
```
## Stop dev environment in docker
```
    $ npm run docker:compose:down
```
## Backend Services

We use several backend services for development

| Url                              | Service        | Description                              |
|----------------------------------|----------------|------------------------------------------|
| [localhost:8103](localhost:8103) | Swagger UI     | Swagger editor                           |
| [localhost:8101](localhost:8101) | Keycloak       | Keycloak SSO Issuer                      |

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
