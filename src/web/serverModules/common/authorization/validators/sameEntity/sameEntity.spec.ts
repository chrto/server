import sameEntity from './sameEntity';
import { expect as expectChai } from 'chai';
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
          expectChai(sameEntity(entity_1, entity_1))
            .to.be.an('boolean')
            .which.is.equal(true);
        });

        it(`Should return 'false' if two entities are not same.`, () => {
          expectChai(sameEntity(entity_1, entity_2))
            .to.be.an('boolean')
            .which.is.equal(false);
        });
      });
    });
  });
});
