import refreshTokens from './refreshTokens';
import doer from 'utils/either/do/doer';
import * as sniff from 'supersniff';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

require('dotenv').config();

const REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5N2M0NDA0MS02Y2NkLTQzN2UtYmU0Ni1kOTkxYjMyZmYxYTIifQ.eyJleHAiOjE2MTMwNTU3OTQsImlhdCI6MTYxMjk2OTM5NCwianRpIjoiNjU2ZDJmOGItMWUxOC00ODI1LTliYzAtYzI5MTI0MDYwYzJjIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTAxL2F1dGgvcmVhbG1zL2RlbW8iLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgxMDEvYXV0aC9yZWFsbXMvZGVtbyIsInN1YiI6ImQwYmMwOGM3LWYyYmYtNGVjMi1iZjJlLTBiMmM0MDljNmM1MyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJzZXJ2ZXIiLCJub25jZSI6IjEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyIiwic2Vzc2lvbl9zdGF0ZSI6ImUxYzBjOWM5LWU1ZDEtNGMyZC05MmUyLWI1ZjZjZWZlNGUxZiIsInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUifQ.K-m7e7R9MNdetpYddrWwxp8m6HBbibkQy9fcnOYcVrY';
const config: ISSOConfig = {
  ssoClientId: process.env.SSO_CLIENT_ID,
  ssoClientSecret: process.env.SSO_CLIENT_SECRET,
  ssoTokenEndpoint: process.env.SSO_TOKEN_ENDPOINT
} as ISSOConfig;

refreshTokens
  .apply(null, [config])
  .apply(null, [{ refresh_token: REFRESH_TOKEN }])
  .then(doer({
    right: sniff,
    left: sniff
  }));
