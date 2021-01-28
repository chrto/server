import { Factory } from 'common/types';
import { TokenSet as TokenSetService } from 'service/http/authentication/types';
import { TokenSet, TokenSetItems } from './tokenSet.types';

const tokenSetFactory: Factory<TokenSetService, TokenSet> = (tokenSetService) => ({
  [TokenSetItems.token_type]: tokenSetService.token_type || undefined,
  [TokenSetItems.expires_in]: tokenSetService.expires_in || undefined,
  [TokenSetItems.ext_expires_in]: tokenSetService.ext_expires_in || undefined,
  [TokenSetItems.id_token]: tokenSetService.id_token || undefined,
  [TokenSetItems.access_token]: tokenSetService.access_token || undefined,
  [TokenSetItems.refresh_token]: tokenSetService.refresh_token || undefined
});

export default tokenSetFactory;
