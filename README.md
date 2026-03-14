# 🛡️ RoleKeeper

Discord 서버에서 역할 관리를 간편하게 할 수 있는 봇입니다. 관리자가 역할-이모지를 연결하면, 사용자는 버튼 클릭으로 역할을 부여받거나 제거할 수 있습니다.

## 📝 프로젝트 소개

서버 관리자가 일일이 역할을 부여하는 번거로움을 줄이기 위해 제작되었습니다. 버튼 기반의 간단한 UI로 사용자가 원하는 역할을 자동으로 획득할 수 있는 시스템입니다.

## ⭐ 주요 기능

- **간편한 역할 설정**: `/setrole` 명령어로 버튼, 이모지, 역할을 쉽게 연결
- **버튼 기반 UI**: 사용자 친화적인 버튼 인터페이스로 역할 선택
- **실시간 역할 관리**: 버튼 클릭 시 즉시 역할 부여/제거 처리
- **데이터 영속성**: JSON 기반 저장으로 봇 재시작 후에도 설정값 유지

## 🛠 기술 스택

- **Language**: JavaScript (Node.js)
- **Library**: discord.js v14+
- **Data Storage**: fs module (JSON)
- **Environment**: dotenv

## 📦 설치 방법

### 필수 조건
- Node.js 16.9 이상
- Discord Bot Token (https://discord.com/developers/applications)
- Discord 서버 관리 권한
- **명령어 사용 권한**: `/setrole` 명령어는 서버 관리자(ADMINISTRATOR 권한)만 사용 가능
- 봇에 다음 권한 필요: 메시지 관리, 역할 관리, 채널 보기

### 설치 단계

1. **저장소 클론**
   ```bash
   git clone https://github.com/your-username/RoleKeeper.git
   cd RoleKeeper
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 설정**
   - `.env.example` 파일을 복사하여 `.env` 파일 생성
   ```bash
   cp .env.example .env
   ```
   - `.env` 파일에 Discord Bot Token 입력
   ```
   TOKEN=your_discord_bot_token_here
   ```

4. **봇 실행**
   ```bash
   npm start
   ```

## 🚀 사용 방법

1. **대시보드 생성** (관리자 권한 필요)
   ```
   /setrole
   ```
   - 봇이 역할 관리 대시보드를 생성합니다.
   - ⚠️ 이 명령어는 **서버 관리자만** 사용 가능합니다.

2. **역할 추가**
   - 대시보드의 "역할 추가" 버튼 클릭
   - 역할 이름과 이모지 입력
   - 역할이 추가되고 버튼이 자동 생성됨

3. **역할 제거**
   - "역할 제거" 버튼 클릭
   - 제거할 역할 이름 입력
   - 역할 버튼이 자동으로 삭제됨

4. **메시지 설정**
   - "메시지 설정" 버튼으로 역할 선택 메시지 커스터마이징
   - 최종 완료 버튼으로 역할 선택 메시지 생성

5. **역할 선택**
   - 사용자가 생성된 역할 선택 메시지의 버튼을 클릭
   - 해당 역할이 자동으로 추가/제거됨

## 📁 프로젝트 구조

```
RoleKeeper/
├── index.js                    # 봇 메인 파일
├── package.json               # 프로젝트 메타데이터
├── .env.example              # 환경 변수 예제
├── .gitignore               # Git 제외 파일
├── bot_data.json            # 역할 설정 데이터 (자동 생성)
├── README.md                # 프로젝트 문서
├── commands/
│   └── setrole.js          # 대시보드 생성 명령어
└── interactions/
    ├── buttons/
    │   ├── addRole.js       # 역할 추가 모달 트리거
    │   ├── deleteRole.js    # 역할 제거 모달 트리거
    │   ├── setMessage.js    # 메시지 설정 모달 트리거
    │   ├── finalize.js      # 최종 완료 처리
    │   └── roleAssign.js    # 역할 선택 버튼 처리
    └── modals/
        ├── addRole_modal.js       # 역할 추가 모달
        ├── deleteRole_modal.js    # 역할 제거 모달
        └── setMessage_modal.js    # 메시지 설정 모달
```

## 💾 데이터 형식

`bot_data.json`에 저장되는 데이터 구조:

```json
{
  "roles": [
    { "name": "개발자", "emoji": "👨‍💻" },
    { "name": "일러스트레이터", "emoji": "🎨" }
  ],
  "roleSettings": {
    "서버ID": {
      "개발자": "역할ID",
      "일러스트레이터": "역할ID"
    }
  },
  "mainMessage": "메시지 내용",
  "dashboard": { "channelId": "채널ID", "messageId": "메시지ID" },
  "roleMessage": { "channelId": "채널ID", "messageId": "메시지ID" }
}
```

## ⚙️ 봇 권한

Discord 애플리케이션 설정에서 다음 권한이 필요합니다:

- **General**: View Channels, Manage Channels
- **Text**: Send Messages, Embed Links, Manage Messages
- **Members**: Manage Roles

## 🤝 기여

이 프로젝트에 개선사항이 있으면 자유롭게 이슈나 풀 리퀘스트를 제출해주세요.

## 📄 라이선스

MIT License