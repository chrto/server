import { Context } from './context.types';
import { ContextFactory } from 'web/serverModules/types';

const contextFactory: ContextFactory<Context> = (_req) => ({});
export default contextFactory;
