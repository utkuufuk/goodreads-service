import { program } from 'commander'

import { pollRss, startServer } from './actions'

if (require.main === module) {
  program.command('poll').description('poll RSS feed').action(pollRss)
  program.command('serve [port]').description('start server').action(startServer)
  program.parse()
}
