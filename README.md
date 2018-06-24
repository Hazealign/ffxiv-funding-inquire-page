# ffxiv-funding-inquire-page

## 설치 방법

1. `npm install -g typescript yarn tslint ts-node pm2 parcel express`
2. `packages/inquire-page-backend`, `packages/inquire-page-frontend` 폴더 각각 들어가서 `yarn` 커맨드 실행
3. API 키 및 스프레드시트 ID가 담긴 json을 `packages/inquire-page-backend` 폴더 안에 `credentials.json` 파일로 저장
4. `ecosystem.config.js` 파일을 열어서 각 `apps` 안에 있는 `interpreter`에 `ts-node` 위치를 입력해야함. (윈도우라면 `C:\Users\Administrator\AppData\Roaming\npm\ts-node.cmd`)
5. cmd에서 `pm2 start ecosystem.config.js`를 실행함.
6. 백그라운드에서 계속 실행될 것. ~편안
