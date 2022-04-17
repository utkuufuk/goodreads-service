import axios from 'axios'
import { Cheerio, load } from 'cheerio'
import { Element } from 'domhandler'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as t from 'io-ts'
import { NonEmptyString } from 'io-ts-types'
import { failure } from 'io-ts/PathReporter'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'

export const RssItem = t.type(
  {
    title: NonEmptyString,
    url: NonEmptyString,
  },
  'RssItem',
)
export type RssItem = t.TypeOf<typeof RssItem>

export const poll = async (feedUrl: NonEmptyString): Promise<E.Either<string, Array<RssItem>>> => {
  const items: Array<RssItem> = []

  try {
    const res = await axios.get(feedUrl, { headers: { 'User-Agent': USER_AGENT } })
    const $ = load(res.data)

    $('channel item').each((_, el) => {
      pipe(
        el,
        $,
        parse,
        RssItem.decode,
        E.fold(
          errors => {
            throw new Error(`could not decode RSS item: ${failure(errors).join(', ')}`)
          },
          i => {
            items.push(i)
          },
        ),
      )
    })
  } catch (err) {
    return E.left(`could not poll RSS feed: ${(err as Error).message}`)
  }

  return E.right(items)
}

const parse = ($item: Cheerio<Element>): Partial<RssItem> => {
  const item: Partial<RssItem> = {}
  $item.children().each((_, el) => {
    if (el.name === 'title') {
      const title = (el.children[0] as any)?.data?.trim()
      item.title = title.replace(/[[\]<>!]/g, '').replace('CDATA', '')
      return
    }

    if (el.name === 'guid') {
      const guid = (el.children[0] as any)?.data?.trim()
      item.url = guid.replace(/[[\]<>!]/g, '').replace('CDATA', '')
      if (!(item.url as string).startsWith('https://')) {
        throw new Error(`invalid URL found in RSS item ${item.url}`)
      }
    }
  })

  return item
}
