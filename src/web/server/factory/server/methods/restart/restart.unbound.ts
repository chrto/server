import { ChildProcess, SpawnOptions } from 'child_process';

import { Fcn } from 'common/types';
import { pipe } from 'ramda';
export default (
  process: NodeJS.Process,
  spawn: Fcn<[String, ReadonlyArray<string>, SpawnOptions], ChildProcess>
) =>
  function (): Promise<void> {
    process.on('exit', function (): void {
      pipe(
        spawn.bind(null, process.argv.shift(), process.argv)
      )
        .apply(null, [{
          cwd: process.cwd(),
          stdio: 'inherit'
        }]);
    });
    return this.stop();
  };
