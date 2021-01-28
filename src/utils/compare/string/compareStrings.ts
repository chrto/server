export enum SensitivityOptions {
  base = 'base',            // a ≠ b, a = á, a = A
  accent = 'accent',        // a ≠ b, a ≠ á, a = A
  case = 'case',            // a ≠ b, a = á, a ≠ A
  variant = 'variant'       // a ≠ b, a ≠ á, a ≠ A
}

export default (string1: string, string2: string, sensitivity: SensitivityOptions): boolean =>
  string1.localeCompare(string2, undefined, { sensitivity }) === 0;
