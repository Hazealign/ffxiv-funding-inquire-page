/**
 * 후원 단위를 나타내는 enum
 */
export enum FundingUnit {
  Personal = '개인', FreeCompany = '부대', RaidGroup = '공대'
}

/**
 * 인게임 서버를 나타내는 enum
 */
export enum ServerType {
  Chocobo = '초코보', Carbuncle = '카벙클', Moogle = '모그리', Tonberry = '톤베리'
}

/**
 * 후원 규모를 나타내는 enum
 */
export enum GroupType {
  Group0 = 'Group0',   // 9900원 미만 후원
  Group1 = 'Group1',   // 9900원 이상 후원
  Group2 = 'Group2'    // 19800원 이상 후원
}

export function findEnumByValue (targetEnum, value) {
  const index = Object.values(targetEnum.valueOf()).indexOf(value)
  const key = Object.keys(targetEnum.valueOf())[index]

  return targetEnum[key]
}

/**
 * Group0 유저 저장형
 */
export interface ILowAmountUser {
  group: GroupType,
  index: number,
  name: string,
  phone: string,
  fee: number
}

/**
 * 일반적인 유저 데이터 구조
 */
export interface IUser extends ILowAmountUser {
  serverName?: ServerType,
  unit?: FundingUnit,
  email?: string,
  addressName?: string,
  zipCode?: number,
  fullAddress?: string,
  fundName?: string
}
