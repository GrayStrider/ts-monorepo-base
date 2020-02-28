const {pathsToModuleNameMapper} = require('ts-jest/utils')

module.exports = ({compilerOptions: {paths}}, {name}) => ({
	preset: 'ts-jest',
	displayName: name.split('/').pop() || name || 'no name',
	globals: {
		'ts-jest': {
			diagnostics: false,
			tsConfig: "packages/server/tsconfig.json"
		}
	},
	moduleNameMapper: paths && pathsToModuleNameMapper(
		paths, {prefix: '<rootDir>/'}),
	testEnvironment: 'node',
	moduleDirectories: [
		'node_modules',
		'src'
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	setupFilesAfterEnv: [
		'jest-expect-message',
		'@strider/utils-ts/utils/testing/customMatchers.ts'
	],
	testRegex: 'test/.*.spec.ts$',
	collectCoverageFrom: [
		'src/**/*.ts'
	],

	coveragePathIgnorePatterns: [
		'src/.*/entity',
		'src/graphql/generated'
	],
	coverageDirectory: '<rootDir>/test/coverage/'
})
