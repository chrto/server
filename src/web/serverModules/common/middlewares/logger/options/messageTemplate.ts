import { AppRequest } from 'web/serverModules/types';
import { Response } from 'express';

interface UserExtension {
  email?: string;
}

export default <UT extends UserExtension> (request: AppRequest<unknown, unknown, UT>, response: Response): string =>
  `${request.currentUser?.email ? `[${request.currentUser.email}] ` : ''}HTTP ${request.method} ${request.url} ${response.statusCode}${(response as any).responseTime ? ` ${(response as any).responseTime}ms` : ''}`;
