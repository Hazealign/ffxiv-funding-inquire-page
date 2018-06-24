import { UserServiceImpl as UserService } from '../services/UserService'
import { Controller, Get, Response, Request, Query, NotFoundException } from '@nestjs/common'
import { Request as RequestType, Response as ResponseType } from 'express'
import { mergeMap } from 'rxjs/operators'

@Controller()
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Get('/api/users')
  search (@Request() request: RequestType, @Response() response: ResponseType,
          @Query('indexNo') _indexNo: string, @Query('lastPhoneNumber') lastPhoneNumber: string) {
    const indexNo = parseInt(_indexNo)
    this.userService.contains(indexNo, lastPhoneNumber).pipe(mergeMap(result => {
      if (result === 0) throw new NotFoundException()

      return (result === 1) ?
        this.userService.selectLowAmountUser(indexNo) : this.userService.selectUser(indexNo)
    })).subscribe(user => {
      response.json({ status: true, user })
    }, error => {
      console.error(error)
      response.json({ status: false, message: error.message })
    })
  }
}
