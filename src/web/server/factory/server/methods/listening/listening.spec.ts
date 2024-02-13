import listening from './listening';

describe('Server Factory', () => {
  describe('Server listening method', () => {
    it(`Should return 'true', if server is listening`, () => {
      const value: boolean = listening.apply({ server: { listening: true } }, []);
      expect(value).toBeBoolean();
      expect(value).toBe(true)();
    });

    it(`Should return 'false', if server is not listening`, () => {
      const value: boolean = listening.apply({ server: { listening: false } }, []);
      expect(value).toBeBoolean();
      expect(value).toBe(false)();
    });

    it(`Should return 'false', if server is not created yet`, () => {
      const value: boolean = listening.apply({ server: null }, []);
      expect(value).toBeBoolean();
      expect(value).toBe(false)();
    });
  });
});
