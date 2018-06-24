import * as proxy from 'http-proxy-middleware'
import * as Bundler from 'parcel-bundler'
import * as express from 'express'
import * as bodyParser from 'body-parser'

const bundler = new Bundler('src/index.html', {
  cache: true
})

const app = express()
app.use('/api', proxy({ target: 'http://localhost:8888' }))
app.use(bodyParser.json())
app.use(bundler.middleware())
app.listen(8889)

module.exports = app
