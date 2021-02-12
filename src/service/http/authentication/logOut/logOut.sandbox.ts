import logOut from './logOut';
import { _do } from 'utils/either';
import * as sniff from 'supersniff';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

require('dotenv').config();

const ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIWGVGRHB6azRHbXduMzdUZ2djRWh5VDhVYmk3ZUZBVExjNklfampfcWJNIn0.eyJleHAiOjE2MTI5NzY5ODUsImlhdCI6MTYxMjk2OTc4NSwiYXV0aF90aW1lIjoxNjEyOTY5MzY4LCJqdGkiOiI1M2FmNWQ5My1lY2U5LTQ4ZmMtODU1NC01NjY0N2FmMDI1YmQiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgxMDEvYXV0aC9yZWFsbXMvZGVtbyIsImF1ZCI6InNlcnZlciIsInN1YiI6ImQwYmMwOGM3LWYyYmYtNGVjMi1iZjJlLTBiMmM0MDljNmM1MyIsInR5cCI6IklEIiwiYXpwIjoic2VydmVyIiwibm9uY2UiOiIxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMiIsInNlc3Npb25fc3RhdGUiOiJlMWMwYzljOS1lNWQxLTRjMmQtOTJlMi1iNWY2Y2VmZTRlMWYiLCJhY3IiOiIxIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBBZG1pbm92aWMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbi5hZG1pbm92aWNAY29tcGFueS5jb20iLCJnaXZlbl9uYW1lIjoiQWRtaW4iLCJmYW1pbHlfbmFtZSI6IkFkbWlub3ZpYyIsImVtYWlsIjoiYWRtaW4uYWRtaW5vdmljQGNvbXBhbnkuY29tIn0.Wo_ILrHnP4SgKvEnIIqXt6P1zaEQzJklbLpW5xU8upS-0uOk6PqPvM1OY0Adv3vGvV-t3KBj_NJnn7h6WKlG11kL1LcNe3LO-awmqbAzVkHI6dxwpzjQdtiAN1qQJQO_I6mBjamczjWf4bmgSUKhmFxRO2xDUp4fRWaIsqqrnqv2YiqYg5_R7GKazMsH16w616jP6bj0pNMf4ErCLURajDz3nPkHOJ_HCOmTuz8476MCkARkIDqRI5GlYhAB0y5Tq2QEjXk34ONsg_qZmksLsZIYjgRZlV3Cq3d4sXAeUe0kEseUBkOwdjq9kHdnociV3WJbe4JjQUPd_1qeF-efGA';
const config: ISSOConfig = {
  ssoEndSessionEndpoint: process.env.SSO_END_SESSION_ENDPOINT,
} as ISSOConfig;

logOut
  .apply(null, [config])
  .apply(null, [ID_TOKEN])
  .then(_do({
    right: sniff,
    left: sniff
  }));
