import { expect as expectChai } from 'chai';
import filterResponse from './filterResponse';

interface Entity {
  item_01: number;
  item_02: boolean;
  item_03: string;
}

const entity_01: Entity = {
  item_01: 1188,
  item_02: true,
  item_03: '83241ef34e6b74af0ad7b8d6ec6d2326e09eb1a5'
};

const entity_02: Entity = {
  item_01: 1188,
  item_02: false,
  item_03: 'f2d5955ffd58a473e3090f5a54cabfbd2795bbd278'
};

const entity_03: Entity = {
  item_01: 1199,
  item_02: true,
  item_03: 'f76aec010432a9445a1105218bf95038678ae4ae'
};

const entity_04: Entity = {
  item_01: 1200,
  item_02: false,
  item_03: '5e7642557e69b1ebf84722737abcd8cfddb5cd20'
};

const entity_05: Entity = {
  item_01: 1207,
  item_02: true,
  item_03: '062b6859d255b8867323e2d2dadf37e06a02f7407e'
};

const entities: Entity[] = [entity_01, entity_02, entity_03, entity_04, entity_05];

const checkTest = (result: Entity[], expected: Entity[]) => {
  expectChai(result).to.be.an('array')
    .which.have.deep.members(expected);
  expectChai(result.length)
    .to.be.equal(expected.length);
};

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`filter response by query parameters`, () => {
      it(`should return entire array, if filter is empty`, () => {
        const result = filterResponse<Entity, Partial<Entity>>({})(entities);
        checkTest(result, entities);
      });

      it(`should return entire array, if filter items are empty`, () => {
        const result = filterResponse<Entity, Partial<Entity>>({ item_01: undefined, item_02: undefined, item_03: '' })(entities);
        checkTest(result, entities);
      });

      it(`should return entire array, if filter items are null`, () => {
        const result = filterResponse<Entity, Partial<Entity>>({ item_01: null, item_02: null, item_03: null })(entities);
        checkTest(result, entities);
      });

      it(`should return entire array, if entities does not have field`, () => {
        const result = filterResponse<Entity, any>({ item_04: 'some_value' })(entities);
        checkTest(result, entities);
      });

      it(`shoud filter by 'item_01' - number`, () => {
        const item_01_value: number = 1188;
        const result = filterResponse<Entity, Partial<Entity>>({ item_01: item_01_value })(entities);
        checkTest(result, [entity_01, entity_02]);
      });

      it(`shoud filter by 'item_02' - boolean`, () => {
        const item_02_value: boolean = false;
        const result = filterResponse<Entity, Partial<Entity>>({ item_02: item_02_value })(entities);
        checkTest(result, [entity_02, entity_04]);
      });

      it(`shoud filter by 'item_03' - fulltext case insensitive`, () => {
        const item_03_value: string = '062b6859d255b8867323e2d2dadf37e06a02f7407e';
        const result = filterResponse<Entity, Partial<Entity>>({ item_03: item_03_value.toUpperCase() })(entities);
        checkTest(result, [entity_05]);
      });

      it(`shoud return empty array, if no match`, () => {
        const result = filterResponse<Entity, Partial<Entity>>({ item_01: 10, item_02: true })(entities);
        checkTest(result, []);
      });
    });
  });
});
