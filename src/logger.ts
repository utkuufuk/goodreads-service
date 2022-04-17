/* eslint-disable no-console */
import chalk from 'chalk'

export const info: typeof console.info = (...args) => console.info(chalk.blue('[INFO]'), ...args)
export const warn: typeof console.warn = (...args) => console.warn(chalk.yellow('[WARN]'), ...args)
export const error: typeof console.error = (...args) => console.error(chalk.red('[ERROR]'), ...args)
