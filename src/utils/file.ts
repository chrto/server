import { exists, mkdir, PathLike, readFile, readFileSync, writeFile } from 'fs';
import { AppError } from 'common/error';

const DEFAUTL_ENCODING = 'utf8';

export const TMP_FOLDER = __dirname + '/uploads/';

export const load = (filename: string, encoding = DEFAUTL_ENCODING): Promise<string> =>
  new Promise((resolve, reject) => {
    readFile(filename, encoding, (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });

export const loadSync = (filename: string, encoding = 'utf8'): string =>
  readFileSync(filename, encoding);

export const getDirectory = (path: PathLike = TMP_FOLDER): Promise<PathLike> =>
  new Promise((resolve, reject) =>
    exists(path, (exists) =>
      exists
        ? resolve(path)
        : mkdir(path, (err) => !!err ? reject(err) : resolve(path))
    )
  );

const save = (fileName: string, base64String: string) =>
  (dirName: string): Promise<string> =>
    new Promise((resolve, reject) =>
      writeFile(dirName + fileName, Buffer.from(base64String, 'base64'), (err: NodeJS.ErrnoException | null) =>
        !!err
          ? reject(new AppError(!!err && !!err.code ? err.code : '', !!err && !!err.message ? err.message : ''))
          : resolve(dirName + fileName)
      )
    );

export const saveFile = (fileName: string, base64String: string, directory: string = TMP_FOLDER): Promise<string> =>
  getDirectory(directory)
    .then(save(fileName, base64String));
