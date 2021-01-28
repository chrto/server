import Middlewares from './middlewares.types';
import authenticationErrorHandler from './authenticationErrorHandler/authenticationErrorHandler';
import errorHandler from './errorHandler/errorHandler';
import jwtAuthentication from './jwtAuthentication/jwtAuthentication';
import loadUserJWT from './loadUserJWT/loadUserJWT';
import logger from './logger/logger';
import cors from './cors/cors';
import bodyParser from './bodyParser/bodyParser';

const middlewares: Middlewares = { authenticationErrorHandler, errorHandler, jwtAuthentication, loadUserJWT, logger, cors, bodyParser };
export default middlewares;
