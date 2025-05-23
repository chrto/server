import addEntityInToRequestImplicits from './addEntityInToRequestImplicits';
import { User } from 'model/sequelize/model/user/user';
import { Response } from 'express';
import { RequestImplicits } from 'web/serverModules/modules/portal/paramHandlers/paramHandlers.types';
import { AppRequest } from 'web/serverModules/types';

interface Implicits extends RequestImplicits {
  impl_01?: string;
  impl_02?: boolean;
}

const RES: Response = {} as Response;
const USER: User = {
  id: '0a0b44eb-97ed-4f41-bbf1-fe01e93efb34',
  email: 'joe.doe@company.com'
} as User;

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`param handler helpers`, () => {
      describe(`add entity in to request implicits`, () => {
        let next: jest.Mock<void, []>;
        beforeAll(() => {
          next = jest.fn().mockReturnValue(null);
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        it(`Should add entity in to existing request implicits`, () => {
          const req: AppRequest<unknown, Implicits> = { implicits: { impl_01: 'test' } } as AppRequest<unknown, Implicits>;
          addEntityInToRequestImplicits(req, RES, next, 'user')(USER);
          expect(req)
            .toHaveProperty('implicits', { user: USER, impl_01: 'test' });
        });

        it(`Should add 'implicits' item in to request and set exact entity in it`, () => {
          const req: AppRequest<unknown, Implicits> = {} as AppRequest<unknown, Implicits>;
          addEntityInToRequestImplicits(req, RES, next, 'user')(USER);
          expect(req)
            .toHaveProperty('implicits', { user: USER });
        });

        it(`Should call NextFunction, after request implicits has been updated`, () => {
          const req: AppRequest<unknown, Implicits> = {} as AppRequest<unknown, Implicits>;
          addEntityInToRequestImplicits(req, RES, next, 'user')(USER);
          expect(next).toHaveBeenCalledTimes(1);
          expect(next).toHaveBeenCalledWith();
        });
      });
    });
  });
});
