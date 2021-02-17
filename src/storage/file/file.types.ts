import { PathLike } from 'fs';
import { WriteFileOptions } from 'fs-extra';

export type FSError = NodeJS.ErrnoException | null;
export type FSPath = PathLike | number;
export type FSReadOptions = { flag?: string; } | { encoding: string; flag?: string; };
export type FSWriteOptions = WriteFileOptions | string;
