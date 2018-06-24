import { NestFactory } from '@nestjs/core'

// Typeorm Shim for use reflecting metadata
import 'reflect-metadata'

import * as express from 'express'
import * as bodyParser from 'body-parser'
import { ApplicationModule } from './modules/modules/ApplicationModule'

async function bootstrap () {
  const instance = express()
  instance.use(bodyParser.json())

  const nestApp = await NestFactory.create(ApplicationModule)
  await nestApp.listen(8888)
}

// for graceful debugging :)
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

bootstrap()
