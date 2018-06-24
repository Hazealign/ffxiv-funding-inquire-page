import * as React from 'react'
import * as Recaptcha from 'react-recaptcha'
import { style } from 'typestyle'
import { Card, CardContent, CardActions, Typography, Button, MuiThemeProvider, createMuiTheme, TextField, Dialog, DialogActions, Snackbar, Slide } from '@material-ui/core'
import { ResultDialog, DialogType } from './dialogs/ResultDialog'
import { GroupType, IUser, ILowAmountUser } from '../models/UserModel'

const cardClass = style({
  maxWidth: '1000px',
  width: '80%',
  margin: '10% auto',
  paddingTop: '30px'
})

const headerBold = style({
  marginTop: '10px',
  fontWeight: 900
})

const formStyle = style({
  width: '90%',
  margin: '50px auto 20px auto',
  textAlign: 'center'
})

const fieldStyle = style({
  width: '150px'
})

const theme = createMuiTheme({
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: '"NanumSquare"'
  }
})

export interface IResponse {
  success: boolean,
  user?: ILowAmountUser,
  message?: string
}

export class App extends React.Component<any, { message?: string, showDialog: boolean }> {
  indexNo: string = ''
  lastPhone: string = ''
  captchaStatus: boolean = false

  type: DialogType = DialogType.None
  response: IResponse | undefined = undefined

  state = {
    showDialog: false,
    message: undefined
  }

  updateIndex (event) {
    this.indexNo = event.target.value
  }

  updateLastPhone (event) {
    this.lastPhone = event.target.value
  }

  async onConfirm (event) {
    if (!this.captchaStatus) {
      this.setState({ message: '캡챠 인증을 진행해주세요!' })
      return
    }

    if (this.indexNo.length >= 8 || this.indexNo === '') {
      this.setState({ message: '텀블벅 후원번호를 확인해주세요!' })
      return
    }

    if (this.lastPhone.length >= 4 || this.lastPhone === '') {
      this.setState({ message: '연락처 뒤 4자리를 확인해주세요!' })
      return
    }

    console.log(this.indexNo)
    console.log(this.lastPhone)

    let type = DialogType.None
    try {
      const response = await fetch(`/api/users?indexNo=${this.indexNo}&lastPhoneNumber=${this.lastPhone}`)
      const body: IResponse = await response.json()

      this.response = body

      if (body.user === undefined) return
      if (body.user.group === GroupType.Group0) {
        type = DialogType.Group0
      } else {
        const user = body.user as IUser
        if (user.email === undefined) type = DialogType.NoServey
        else if (user.fundName === undefined) type = DialogType.NoNickname
        else type = DialogType.Normal
      }
    } catch (error) {
      console.error(error)
      type = DialogType.NotFound
    }

    this.type = type
    this.setState({ showDialog: true })
  }

  handleDialogClose () {
    this.setState({ showDialog: false })
  }

  onCaptchaUpdate (_) {
    this.captchaStatus = true
  }

  downTransition (props) {
    return <Slide {...props} direction='up' />
  }

  handleSnackBarClose (evt, reason) {
    this.setState({ message: undefined })
  }

  render () {
    return (<div>
      <MuiThemeProvider theme={theme}>
        <Card className={cardClass} >
          <CardContent>
            <Typography variant='title' className='title'>
              파이널판타지14 한국 서비스<br/>
              3주년 기념 지하철역 광고 프로젝트
            </Typography>
            <Typography className={headerBold} variant='title'>
              후원자 인증 확인 페이지
            </Typography>

            <div className={formStyle}>
              <TextField required type='number' style={{ width: 250, margin: '0px 20px' }} id='required' label='후원 번호' margin='normal' onChange={e => this.updateIndex(e)} />
              <TextField required type='number' style={{ width: 250, margin: '0px 20px' }} id='required' label='연락처 뒤 4자리' margin='normal' onChange={e => this.updateLastPhone(e)} />
              <div style={{ margin: '20px auto', display: 'inline-block' }}><Recaptcha sitekey='6LdyemAUAAAAAFCnbNtuq8hbwKDDTr6vIaBC6Ua_' render='explicit' verifyCallback={value => this.onCaptchaUpdate(value)} /></div>
            </div>

            <Typography>※ 본 화면은 <b>PC와 모던 브라우저(크롬, 파이어폭스, 엣지, 사파리 등)</b>에 최적화 되어있습니다.</Typography>
            <Typography>※ 인증요청 후 <b>익일 정오</b>부터 조회 가능합니다.</Typography>
            <Typography>※ Robot 방지를 위해 <b>reCAPTCHA</b>를 적용했습니다.</Typography>
          </CardContent>

          <CardActions style={{ float: 'right' }}>
            <Button color='primary' style={{ width: 100 }} onClick={async e => {
              await this.onConfirm(e)
              return
            }}>
              확인
            </Button>
          </CardActions>
        </Card>

        {this.state.showDialog ? (<Dialog open={this.state.showDialog} maxWidth='md'>
          <ResultDialog response={this.response} type={this.type} />
          <DialogActions>
            <Button onClick={e => this.handleDialogClose()} color='primary'>
              확인
            </Button>
          </DialogActions>
        </Dialog>) : <div/>}

        <Snackbar
          open={this.state.message !== undefined}
          message={<span id='message-id'>{this.state.message}</span>}
          autoHideDuration={2000}
          onClose={(evt, reason) => this.handleSnackBarClose(evt, reason)}
          TransitionComponent={this.downTransition}
          transitionDuration={{ enter: 500, exit: 500 }}
        />
      </MuiThemeProvider>
    </div>)
  }
}
