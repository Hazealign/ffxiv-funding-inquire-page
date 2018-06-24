// Shim for use reflecting metadata
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './modules/modules/ApplicationModule'

async function bootstrap () {
  const nestApp = await NestFactory.create(ApplicationModule)
  await nestApp.listen(8888)
}

// for graceful debugging :)
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

bootstrap()
