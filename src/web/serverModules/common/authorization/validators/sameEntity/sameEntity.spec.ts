import sameEntity from './sameEntity';
import { Entity } from 'model/sequelize/modelFactory/modelFactory.types';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`authorization`, () => {
      describe(`sameEntity`, () => {
        const entity_1: Entity<number> = {
          id: 1
        };
        const entity_2: Entity<number> = {
          id: 2
        };
        it(`Should return 'true' if two entities are same.`, () => {
          expect(sameEntity(entity_1, entity_1)).toBeTrue;
        });

        it(`Should return 'false' if two entities are not same.`, () => {
          expect(sameEntity(entity_1, entity_2)).toBeFalse;
        });
      });
    });
  });
});
