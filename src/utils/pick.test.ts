import { pickProperties } from './pick';

describe('Test `Pick` module', function () {

    it('should pick correct values from object', function () {
        const properties = ['b'];
        const source = {
            a: 1,
            b: 2,
            c: 3
        };
        const expected = {
            b: 2
        };
        expect(pickProperties(properties)(source)).toMatchObject(expected);
    });

    it('should return empty object when no matching fields', function () {
        const properties = ['x'];
        const source = {
            a: 1,
            b: 2,
            c: 3
        };
        const expected = {};

        expect(pickProperties(properties)(source)).toMatchObject(expected);
    });

    it('should return array, if field is array', function () {
        const properties = ['a', 'b'];
        const source = {
            a: [1, 2, 3],
            b: 2,
            c: 3
        };
        const expected = {
          a: [1, 2, 3],
          b: 2
      };
        expect(pickProperties(properties)(source)).toMatchObject(expected);
    });

    it('should return array, if field is array with objects and has not \'id\'', function () {
        const properties = ['a', 'b'];
        const source = {
          a: [
            {
              name: 'one'
            },
            {
              name: 'two'
            }
          ],
          b: 2,
          c: 3
        };
        const expected = {
          a: [
            {
              name: 'one'
            },
            {
              name: 'two'
            }
          ],
          b: 2
        };
        expect(pickProperties(properties)(source)).toMatchObject(expected);
    });
});
