import { Injectable, NotFoundException } from '@nestjs/common'
import { Observable, from } from 'rxjs'
import { ILowAmountUser, IUser, GroupType, ServerType, FundingUnit, findEnumByValue } from '../models/UserModel'
import { google } from 'googleapis'
import { mergeMap, map } from 'rxjs/operators'
const { apiKey, sheetsId } = require('./../../../credentials.json')

export interface IUserService {
  contains (indexNo: number, lastPhoneNumber: string): Observable<number>
  selectUser (indexNo: number): Observable<IUser>
  selectLowAmountUser (indexNo: number): Observable<ILowAmountUser>
}

@Injectable()
export class UserServiceImpl implements IUserService {
  private queryToSheets (group: GroupType): Promise<Array<any>> {
    const sheets = google.sheets({ version: 'v4', auth: apiKey })

    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get({
        spreadsheetId: sheetsId,
        range: group + '!A2:Z'
      }, (err, { data }) => {
        if (err) reject(err)
        else resolve(data.values)
      })
    })
  }

  private sheetRowToLowAmountUser (input: Array<any>): Array<ILowAmountUser> {
    return input.map(row => {
      return {
        group: GroupType.Group0,
        index: parseInt(row[0]),
        name: row[1],
        fee: row[2],
        phone: row[3]
      }
    })
  }

  private sheetRowToUser (group: GroupType, input: Array<any>): Array<IUser> {
    return input.map(row => {
      return group === GroupType.Group1 ? {
        index: parseInt(row[0]),
        name: row[1],
        fee: parseInt(row[2]),
        phone: row[3],
        group: GroupType.Group1,
        serverName: findEnumByValue(ServerType, row[9]),
        unit: findEnumByValue(FundingUnit, row[10]),
        email: row[5],
        fundName: row[11]
      } : {
        index: parseInt(row[0]),
        name: row[1],
        fee: parseInt(row[2]),
        phone: row[3],
        group: GroupType.Group2,
        serverName: findEnumByValue(ServerType, row[13]),
        unit: findEnumByValue(FundingUnit, row[14]),
        email: row[9],
        addressName: row[8],
        zipCode: row[6],
        fullAddress: row[7],
        fundName: row[15]
      }
    })
  }

  /**
   * 구글 시트 데이터베이스에 해당 사용자가 있는지 질의합니다.
   *
   * @param indexNo 후원 번호
   * @param lastPhoneNumber 휴대폰 뒷자리
   * @return 0 -> false, 1 -> LowAmountUser, 2 -> User
   */
  contains (indexNo: number, lastPhoneNumber: string): Observable<number> {
    const $group0 = from(this.queryToSheets(GroupType.Group0))
      .pipe(map(this.sheetRowToLowAmountUser))
    const $group1 = from(this.queryToSheets(GroupType.Group1))
      .pipe(map(sheets => this.sheetRowToUser(GroupType.Group1, sheets)))
    const $group2 = from(this.queryToSheets(GroupType.Group2))
      .pipe(map(sheets => this.sheetRowToUser(GroupType.Group2, sheets)))

    return $group0.pipe(mergeMap(group0 => {
      return $group1.pipe(map(group1 => ({ group0, group1 })))
    })).pipe(mergeMap(value => {
      return $group2.pipe(map(group2 => ({ group0: value.group0, group1: value.group1, group2: group2 })))
    })).pipe(map(value => {
      const filterFunc = user => (user.index === indexNo && user.phone.indexOf(lastPhoneNumber) !== -1)

      if (value.group0.filter(filterFunc).length === 1) return 1
      if (value.group1.filter(filterFunc).length === 1 || value.group2.filter(filterFunc).length === 1) return 2
      return 0
    }))
  }

  /**
   * 후원 번호로 사용자를 조회합니다.
   *
   * @param indexNo 후원 번호
   */
  selectUser (indexNo: number): Observable<IUser> {
    const $group1 = from(this.queryToSheets(GroupType.Group1))
      .pipe(map(sheets => this.sheetRowToUser(GroupType.Group1, sheets)))
    const $group2 = from(this.queryToSheets(GroupType.Group2))
      .pipe(map(sheets => this.sheetRowToUser(GroupType.Group2, sheets)))

    return $group1.pipe(mergeMap(group1 => {
      return $group2.pipe(map(group2 => group1.concat(group2)))
    })).pipe(map(users => {
      const userArray = users.filter(user => user.index === indexNo)
      if (userArray.length === 1) return userArray[0]
      throw new NotFoundException()
    }))
  }

  /**
   * 후원 번호로 소액 후원 사용자를 조회합니다.
   *
   * @param indexNo 후원 번호
   */
  selectLowAmountUser (indexNo: number): Observable<ILowAmountUser> {
    return from(this.queryToSheets(GroupType.Group0))
      .pipe(map(this.sheetRowToLowAmountUser))
      .pipe(map(users => {
        const userArray = users.filter(user => user.index === indexNo)
        if (userArray.length === 1) return userArray[0]
        throw new NotFoundException()
      }))
  }
}
