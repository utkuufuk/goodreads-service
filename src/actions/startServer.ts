import express, { Application, Request, Response } from 'express'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

import { PORT, RSS_FEED, SECRET } from '../config'
import * as logger from '../logger'
import { poll } from '../rss'

const server: Application = express()

server.use(express.json())

server.get('/entrello', async (req: Request, res: Response) => {
  if (SECRET !== req.headers['x-api-key']) {
    return res.status(401).end()
  }

  pipe(
    await poll(RSS_FEED),
    E.fold(
      err => res.status(500).json({ message: `Could not fetch RSS items from Goodreads: ${err}` }),
      items => res.status(200).json(items.map(i => ({ Name: i.title, Desc: i.url }))),
    ),
  )
})

// @todo: implement
server.post('/entrello', async (req: Request, res: Response) => res.status(200).end())

export const startServer = () => {
  server.listen(PORT, () => logger.info(`Starting server on port ${PORT}`))
}
