import refreshTokensUnbound from './refreshTokens';
import axios from 'axios';
import * as sniff from 'supersniff';
import { _do } from 'utils/either';
import { ISSOConfig } from 'web/server/configuration/loader/sso/ssoConfig.types';

require('dotenv').config();

const REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5N2M0NDA0MS02Y2NkLTQzN2UtYmU0Ni1kOTkxYjMyZmYxYTIifQ.eyJleHAiOjE2MTA0NzkyNjQsImlhdCI6MTYxMDQ3NzQ2NCwianRpIjoiN2UxM2IwYjgtMjRkZS00MzMyLTlmODEtNTI4NmY3MDUwMGZkIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MTAxL2F1dGgvcmVhbG1zL2RlbW8iLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgxMDEvYXV0aC9yZWFsbXMvZGVtbyIsInN1YiI6ImQwYmMwOGM3LWYyYmYtNGVjMi1iZjJlLTBiMmM0MDljNmM1MyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJzZXJ2ZXIiLCJub25jZSI6IjEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyIiwic2Vzc2lvbl9zdGF0ZSI6ImM3N2FmOWQwLTk4MDMtNDk0OC04ZTJlLWExMDgyMDU0NWJlOSIsInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUifQ.iTlewYLMMD-Ub-T9id1q9Dl9jse-uhpmebZ1l1rLFkI';
const config: ISSOConfig = {
  ssoClientId: process.env.SSO_CLIENT_ID,
  ssoClientSecret: process.env.SSO_CLIENT_SECRET,
  ssoTokenEndpoint: process.env.SSO_TOKEN_ENDPOINT
} as ISSOConfig;

refreshTokensUnbound
  .apply(null, [axios.create(), config])
  .apply(null, [{ refresh_token: REFRESH_TOKEN }])
  .then(_do({
    right: sniff,
    left: sniff
  }));
