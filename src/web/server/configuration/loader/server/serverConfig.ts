import serverConfigUnbound from './serverConfig.unbound';

export default serverConfigUnbound.apply(null, [process.env]);
