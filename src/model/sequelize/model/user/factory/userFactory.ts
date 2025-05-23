import userFactoryUnbound from './userFactory.unbound';
import { v4 as uuidv4 } from 'uuid';

export default userFactoryUnbound.apply(null, [uuidv4]);
