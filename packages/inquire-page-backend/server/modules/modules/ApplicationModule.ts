import { UserModule } from './UserModule'
import { Module } from '@nestjs/common'

@Module({ modules: [UserModule] })
export class ApplicationModule {}
