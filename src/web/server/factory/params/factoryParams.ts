import factoryParamsUnbound from './factoryParams.unbound';
import * as express from 'express';
import modelFactory from 'model/sequelize/modelFactory/modelFactory';
import serviceFactory from 'service/serviceFactory/serviceFactory';

export default factoryParamsUnbound.apply(null, [express, serviceFactory, modelFactory]);
