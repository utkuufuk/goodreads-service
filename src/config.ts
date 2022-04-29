/* eslint-disable node/no-process-env */

/**
 * The usage of 'process.env.XYZ' is globally forbidden by the ESLint configuration.
 * This module is exempt from this rule, as it acts as a gateway to parsed environment variables.
 */
require('dotenv').config()
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import { PositiveIntFromString } from 'io-ts-types-ext'
import { failure } from 'io-ts/PathReporter'

const MandatoryConfig = t.type(
  {
    PORT: PositiveIntFromString,
    RSS_FEED: NonEmptyString,
    SECRET: NonEmptyString,
  },
  'MandatoryEnvironmentVariables',
)
type MandatoryConfig = t.TypeOf<typeof MandatoryConfig>

const OptionalConfig = t.partial(
  {
    NODE_ENV: t.union([t.literal('test'), t.literal('development'), t.literal('production')]),
  },
  'OptionalEnvironmentVariables',
)
type OptionalConfig = t.TypeOf<typeof OptionalConfig>

const NON_PROD_DEFAULTS: { [K in keyof MandatoryConfig]: string } = {
  PORT: '4000',
  RSS_FEED: 'https://example.com/rss',
  SECRET: 'xxxxxxxxxxxxxxxxxxxxxxx',
}

// default values for optional variables applicable in all environments, including production
const ALL_ENV_DEFAULTS: Required<Pick<OptionalConfig, 'NODE_ENV'>> = {
  NODE_ENV: 'development',
}

export default pipe(
  process.env.NODE_ENV === 'production' ? process.env : { ...NON_PROD_DEFAULTS, ...process.env },
  t.intersection([MandatoryConfig, OptionalConfig]).decode,
  E.mapLeft(errors => failure(errors).join(', ')),
  E.fold(
    message => {
      throw new Error(`Could not parse environment variables: ${message}`)
    },
    config => ({ ...ALL_ENV_DEFAULTS, ...config }),
  ),
)
