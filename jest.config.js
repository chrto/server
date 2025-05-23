module.exports = {
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testRegex: '/src/.*\\.(test|spec)?\\.(ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ["jest-extended/all"],
  moduleNameMapper: {
    "^common/(.*)": "<rootDir>/src/common/$1",
    "^config/(.*)": "<rootDir>/src/config/$1",
    "^model/(.*)": "<rootDir>/src/model/$1",
    "^service/(.*)": "<rootDir>/src/service/$1",
    "^storage/(.*)": "<rootDir>/src/storage/$1",
    "^utils/(.*)": "<rootDir>/src/utils/$1",
    "^web/(.*)": "<rootDir>/src/web/$1",
    "^logger/(.*)": "<rootDir>/src/logger/$1",
    "^src/(.*)": "<rootDir>/src/$1",
},
};
