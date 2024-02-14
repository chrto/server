import differentEntity from './differentEntity';
import { Entity } from 'model/sequelize/modelFactory/modelFactory.types';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`authorization`, () => {
      describe(`differentEntity`, () => {
        const entity_1: Entity<number> = {
          id: 1
        };
        const entity_2: Entity<number> = {
          id: 2
        };
        it(`Should return 'true' if two entities are not same entities.`, () => {
          expect(differentEntity(entity_1, entity_2)).toBeTrue;
        });

        it(`Should return 'false' if two entities are same entities.`, () => {
          expect(differentEntity(entity_1, entity_1)).toBeFalse;
        });
      });
    });
  });
});
