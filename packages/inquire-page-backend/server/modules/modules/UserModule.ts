import { Module } from '@nestjs/common'
import { UserController } from '../controllers/UserController'
import { UserServiceImpl as UserService } from '../services/UserService'

@Module({
  controllers: [ UserController ],
  providers: [ UserService ]
})
export class UserModule {

}
