import chalk from 'chalk'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

import cfg from '../config'
import * as logger from '../logger'
import { poll } from '../rss'

export const pollRss = async (): Promise<void> => {
  pipe(
    await poll(cfg.RSS_FEED),
    E.fold(
      err => logger.error(`Could not poll RSS feed: ${err}`),
      items => {
        logger.info(`Parsed ${chalk.magenta(items.length)} RSS items`)
        items.forEach(i => logger.info(`${chalk.cyan(i.title)} - ${chalk.green(i.url)}`))
      },
    ),
  )
}
