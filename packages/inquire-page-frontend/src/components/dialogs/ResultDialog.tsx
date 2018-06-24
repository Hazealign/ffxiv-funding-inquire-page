import * as React from 'react'
import { IUser, ILowAmountUser, GroupType } from '../../models/UserModel'
import { DialogTitle, DialogContent, DialogContentText, TextField } from '@material-ui/core'
import { IResponse } from '../App'

export interface DialogProps {
  response: IResponse,
  type: DialogType
}

export enum DialogType {
  None, NotFound, Group0, Normal, NoServey, NoNickname
}

export class ResultDialog extends React.Component<DialogProps> {
  render () {
    console.log(this.props.type)

    switch (this.props.type) {
      case DialogType.NotFound:
        return (<div>
          <DialogTitle id='alert-dialog-slide-title'><b>후원자 정보가 존재하지 않습니다.</b></DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>후원번호, 텀블벅에 등록된 연락처 뒤 4자리를 올바르게 입력하였는지 다시 한 번 확인해 주시기 바랍니다.</DialogContentText>
          </DialogContent>
        </div>)
      case DialogType.Group0:
        return (<div>
        <DialogTitle id='alert-dialog-slide-title'><b>후원자 정보 확인</b></DialogTitle>
          <DialogContent>
            <div style={{ margin: '45px' }}>
              <div style={{ margin: '10px' }}>
                <TextField disabled type='number' style={{ width: 200, margin: '0px 20px' }} label='후원번호' margin='normal' value={this.props.response.user.index} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='텀블벅 이름' margin='normal' value={this.props.response.user.name} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='후원단위' margin='normal' value='개인' />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='선물분류' margin='normal' value='없음' />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='서버명' margin='normal' value='' />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='후원자명' margin='normal' value='' />
              </div>
            </div>
            <DialogContentText id='alert-dialog-slide-description' style={{ fontSize: '1.5rem' }}><b>후원자명 인증 대상이 아닙니다.</b></DialogContentText>
            <DialogContentText id='alert-dialog-slide-description'>펀딩 금액 변경은 7월 12일(목) 23시 59분까지 가능하며,<br/>후원자명 인증 및 서베이 마감은 7월 22일(일) 오후 5시 59분입니다.</DialogContentText>
          </DialogContent>
        </div>)
      case DialogType.Normal:
        let user = this.props.response.user as IUser
        return (<div>
        <DialogTitle id='alert-dialog-slide-title'><b>후원자 정보 확인 [인증 완료!]</b></DialogTitle>
          <DialogContent>
            <div style={{ margin: '45px' }}>
              <div style={{ margin: '10px' }}>
                <TextField disabled type='number' style={{ width: 200, margin: '0px 20px' }} label='후원번호' margin='normal' value={this.props.response.user.index} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='텀블벅 이름' margin='normal' value={this.props.response.user.name} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='후원단위' margin='normal' value={user.unit} />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='선물분류' margin='normal' value={user.group === GroupType.Group2 ? '19,800원 +' : '9,900원+'} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='서버명' margin='normal' value={user.serverName} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='후원자명' margin='normal' value={user.fundName} />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 680, margin: '0px 20px' }} label='월페이퍼용 이메일 주소' margin='normal' value={user.email} />
              </div>
              {user.group === GroupType.Group2 ? (<div><div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 320, margin: '0px 20px' }} label='수취인명' margin='normal' value={user.addressName} />
                <TextField disabled style={{ width: 320, margin: '0px 20px' }} label='우편번호' margin='normal' value={user.zipCode} />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 680, margin: '0px 20px' }} label='주소' margin='normal' value={user.fullAddress} />
              </div></div>) : <div />}
            </div>
            <DialogContentText id='alert-dialog-slide-description' style={{ fontSize: '1.5rem' }}><b>후원자명 인증이 완료되었습니다.</b></DialogContentText>
            <DialogContentText id='alert-dialog-slide-description'>
              배송지 및 서베이 수정은 7월 22일(일) 오후 5시 59분까지 가능하며, 이후 수정이 불가합니다.
              <br/>
              잘못된 정보가 있거나, 수정을 원하시면 창작자에게 문의하기 기능을 이용해주세요.
            </DialogContentText>
          </DialogContent>
        </div>)
      case DialogType.NoNickname:
        user = this.props.response.user as IUser
        return (<div>
        <DialogTitle id='alert-dialog-slide-title'><b>후원자 정보 확인 [인증 필요!]</b></DialogTitle>
          <DialogContent>
            <div style={{ margin: '45px' }}>
              <div style={{ margin: '10px' }}>
                <TextField disabled type='number' style={{ width: 200, margin: '0px 20px' }} label='후원번호' margin='normal' value={this.props.response.user.index} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='텀블벅 이름' margin='normal' value={this.props.response.user.name} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='후원단위' margin='normal' value={user.unit} />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='선물분류' margin='normal' value={user.group === GroupType.Group2 ? '19,800원 +' : '9,900원+'} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='서버명' margin='normal' value={user.serverName} />
                <TextField disabled style={{ width: 200, margin: '0px 20px' }} label='후원자명' margin='normal' value={user.fundName} />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 680, margin: '0px 20px' }} label='월페이퍼용 이메일 주소' margin='normal' value={user.email} />
              </div>
              {user.group === GroupType.Group2 ? (<div><div style={{ margin: '5px' }}>
                <TextField disabled style={{ width: 320, margin: '0px 20px' }} label='수취인명' margin='normal' value={user.addressName} />
                <TextField disabled style={{ width: 320, margin: '0px 20px' }} label='우편번호' margin='normal' value={user.zipCode} />
              </div>
              <div style={{ margin: '10px' }}>
                <TextField disabled style={{ width: 680, margin: '0px 20px' }} label='주소' margin='normal' value={user.fullAddress} />
              </div></div>) : <div />}
            </div>
            <DialogContentText id='alert-dialog-slide-description' style={{ fontSize: '1.5rem', color: 'red' }}><b>후원자명 인증이 완료되지 않았습니다.</b></DialogContentText>
            <DialogContentText id='alert-dialog-slide-description' style={{ color: 'red' }}>
              텀블벅 프로젝트 페이지 "후원자명 기재에 관련한 양식"을 참고하여 이메일을 보내주세요.
              <br/>
              후원자명 인증 및 서베이 마감은 7월 22일(목) 오후 5시 59분까지입니다.
            </DialogContentText>
          </DialogContent>
        </div>)
      case DialogType.NoServey:
        return (<div>
          <DialogTitle id='alert-dialog-slide-title'><b>서베이에 응답하지 않으셨습니다.</b></DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
            텀블벅 서베이에 응답 후, 후원자명 인증 절차를 진행해주세요.
            <br/>
            후원자명 인증 및 서베이 마감은 7월 22일(목) 오후 5시 59분까지입니다.</DialogContentText>
          </DialogContent>
        </div>)
      default:
        return <div />
    }
  }
}
