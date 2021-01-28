import allAuthenticated from './allAuthenticated';
import { assert as assertChai } from 'chai';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`authorization`, () => {
      describe(`all authenticated access`, () => {
        it('Should allows access for everybody', () => {
          allAuthenticated({})
            .do({
              just: () =>
                assertChai
                  .fail(null, null, 'Nothing has been expected'),
              nothing: () =>
                assertChai.ok
          });
        });
      });
    });
  });
});
