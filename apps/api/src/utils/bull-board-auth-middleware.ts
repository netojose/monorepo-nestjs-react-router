import * as http from 'node:http'

import { get } from 'radash'

export function bullBoardAuthMiddleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: VoidFunction,
  checkUser: string,
  checkPassword: string
) {
  const authorization = get<string>(req.headers, 'authorization')

  if (!authorization?.startsWith('Basic ')) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"')
    res.end('Unauthorized')
    return
  }

  const encoded = authorization.slice('Basic '.length)
  const decoded = Buffer.from(encoded, 'base64').toString('utf8')
  const [username, password] = decoded.split(':')

  if (username !== checkUser || password !== checkPassword) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"')
    res.end('Unauthorized')
    return
  }

  next()
}
