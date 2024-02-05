import allAuthenticated from './allAuthenticated';

describe(`Test 'web' module`, () => {
  describe(`common`, () => {
    describe(`authorization`, () => {
      describe(`all authenticated access`, () => {
        it('Should allows access for everybody', () => {
          allAuthenticated({})
            .do({
              just: () =>
                fail('Nothing has been expected'),
              nothing: () => null
          });
        });
      });
    });
  });
});
