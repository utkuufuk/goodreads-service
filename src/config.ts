/* eslint-disable node/no-process-env */

/**
 * The usage of 'process.env.XYZ' is globally forbidden by the ESLint configuration.
 * This module is exempt from this rule, as it acts as a gateway to parsed environment variables.
 */
require('dotenv').config()
import * as E from 'fp-ts/Either'
import { identity, pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import { PositiveIntFromString } from 'io-ts-types-ext'
import { failure } from 'io-ts/PathReporter'

const Config = t.intersection([
  // mandatory envars
  t.type(
    {
      PORT: PositiveIntFromString,
      RSS_FEED: NonEmptyString,
    },
    'Mandatory Environment Variables',
  ),

  // optional envars
  t.partial(
    {
      NODE_ENV: t.union([t.literal('test'), t.literal('development'), t.literal('production')]),
    },
    'Optional Environment Variables',
  ),
])

// set dummy variables for missing mandatory environment variables during development and testing
const envars =
  process.env.NODE_ENV === 'production'
    ? process.env
    : {
        ...process.env,
        PORT: process.env.PORT ?? '4000',
        RSS_FEED: process.env.RSS_FEED ?? 'https://example.com/rss',
      }

// decode environment variables
const cfg = pipe(
  envars,
  Config.decode,
  E.mapLeft(errors => failure(errors).join(', ')),
  E.fold(err => {
    throw new Error(`Could not parse environment variables: ${err}`)
  }, identity),
)

export const PORT = cfg.PORT
export const NODE_ENV = cfg.NODE_ENV ?? 'development'
export const RSS_FEED = cfg.RSS_FEED
