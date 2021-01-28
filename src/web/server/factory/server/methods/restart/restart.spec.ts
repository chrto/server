import restartUnbound from './restart.unbound';
import { WebServer } from 'web/server/types';
import { ChildProcess, SpawnOptions } from 'child_process';

const CHILD_PROCESS: ChildProcess = {} as ChildProcess;
const CWD = '/current/work/dir';
const PROCESS_ARGS = [
  '/path/to/node/bin/node',
  `${CWD}/dist/server.dev.js`
];

describe('Server Factory', () => {
  describe('Server restart method', () => {
    let process;
    let self: Partial<WebServer>;
    let spawn: jest.Mock<ChildProcess, [String, ReadonlyArray<string>, SpawnOptions]>;
    let mockProcessOn: jest.Mock<NodeJS.Process, [String, NodeJS.ExitListener]>;
    beforeAll(() => {
      spawn = jest.fn().mockReturnValue(CHILD_PROCESS);
      mockProcessOn = jest.fn().mockImplementation((_event: String, listener: NodeJS.ExitListener): NodeJS.Process => {
        listener(0);
        return process;
      });
      process = {
        on: mockProcessOn,
        cwd: jest.fn().mockReturnValue(CWD),
        argv: [...PROCESS_ARGS]
      };
      self = {
        stop: jest.fn().mockResolvedValue(null)
      };

      restartUnbound
        .apply(null, [process, spawn])
        .apply(self, []);
    });

    it(`Should register 'exit' event listener callback`, () => {
      expect(process.on)
        .toHaveBeenCalledTimes(1);
      expect(process.on)
        .toHaveBeenCalledWith('exit', expect.toBeFunction());
    });

    it(`Should run application, after 'exit' event has been emited`, () => {
      expect(spawn)
        .toHaveBeenCalledTimes(1);
      expect(spawn)
        .toHaveBeenCalledWith(
          PROCESS_ARGS[0],
          [PROCESS_ARGS[1]],
          {
            cwd: CWD,
            stdio: 'inherit'
          }
        );
    });

    it(`Should stop server, after exit event has been registered`, () => {
      expect(self.stop)
        .toHaveBeenCalledTimes(1);
      expect(self.stop)
        .toHaveBeenCalledWith();
      expect(self.stop)
        .toHaveBeenCalledAfter(process.on);
    });
  });
});
