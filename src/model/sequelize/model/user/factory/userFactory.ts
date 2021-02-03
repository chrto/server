import userFactoryUnbound from './userFactory.unbound';
import * as uuid from 'uuid/v4';

export default userFactoryUnbound.apply(null, [uuid]);
