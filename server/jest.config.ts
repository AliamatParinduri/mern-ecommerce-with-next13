import type { Config } from '@jest/types'
import jestModuleNameMapper from 'jest-module-name-mapper'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  forceExit: true,
  moduleNameMapper: jestModuleNameMapper()
}

export default config
