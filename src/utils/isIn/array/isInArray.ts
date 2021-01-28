export default <T>(array1: T[], array2: T[]): boolean => array2.every((item: T): boolean => array1.includes(item));
