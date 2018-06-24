import * as proxy from 'http-proxy-middleware'
import * as Bundler from 'parcel-bundler'
import * as express from 'express'

const bundler = new Bundler('src/index.html', {
  cache: false
})

const app = express()
app.use('/api', proxy({ target: 'http://localhost:8888' }))

app.use(bundler.middleware())
app.listen(Number(process.env.PORT || 1234))
