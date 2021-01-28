import differentEntity from './differentEntity';
import { expect as expectChai } from 'chai';
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
          expectChai(differentEntity(entity_1, entity_2))
            .to.be.an('boolean')
            .which.is.equal(true);
        });

        it(`Should return 'false' if two entities are same entities.`, () => {
          expectChai(differentEntity(entity_1, entity_1))
            .to.be.an('boolean')
            .which.is.equal(false);
        });
      });
    });
  });
});
