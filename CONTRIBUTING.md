# Contributing to MediInside

MediInside 프로젝트에 기여해 주셔서 감사합니다! 이 문서는 프로젝트 기여 방법에 대한 가이드라인을 제공합니다.

## 목차

- [행동 강령](#행동-강령)
- [시작하기](#시작하기)
- [개발 환경 설정](#개발-환경-설정)
- [기여 방법](#기여-방법)
- [코드 스타일 가이드](#코드-스타일-가이드)
- [커밋 메시지 가이드](#커밋-메시지-가이드)
- [Pull Request 프로세스](#pull-request-프로세스)
- [이슈 보고](#이슈-보고)

## 행동 강령

모든 기여자는 상호 존중하고 전문적인 환경을 유지해야 합니다. 차별, 괴롭힘, 또는 부적절한 행동은 용납되지 않습니다.

## 시작하기

1. 이 저장소를 Fork합니다
2. Fork한 저장소를 로컬에 클론합니다
3. 업스트림 저장소를 추가합니다:
   ```bash
   git remote add upstream https://github.com/koreankennedy/mediinside-v3.git
   ```

## 개발 환경 설정

### 필수 요구사항

- Node.js 20.x 이상
- npm 10.x 이상
- Git

### 설정 단계

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local

# 개발 서버 실행
npm run dev

# 타입 체크
npm run type-check

# 린트 실행
npm run lint
```

## 기여 방법

### 1. 이슈 확인

- 기존 이슈를 확인하여 중복을 피합니다
- 작업할 이슈를 선택하거나 새 이슈를 생성합니다
- 이슈에 본인을 할당하고 작업 시작을 알립니다

### 2. 브랜치 생성

```bash
# 최신 main 브랜치로 업데이트
git checkout main
git pull upstream main

# 새 브랜치 생성
git checkout -b feature/issue-번호-설명
# 예: git checkout -b feature/123-add-login-validation
```

### 3. 코드 작성

- 기존 코드 스타일을 따릅니다
- 테스트를 작성합니다
- 타입 안정성을 확인합니다

### 4. 테스트

```bash
# 테스트 실행
npm run test

# 린트 체크
npm run lint

# 타입 체크
npm run type-check

# 빌드 확인
npm run build
```

## 코드 스타일 가이드

### TypeScript

```typescript
// 인터페이스는 I 접두사 없이 PascalCase
interface UserProfile {
  id: string;
  name: string;
}

// 타입은 PascalCase
type UserRole = 'seeker' | 'employer';

// 함수는 camelCase
function getUserProfile(userId: string): UserProfile {
  // ...
}

// 컴포넌트는 PascalCase
export function UserProfileCard({ user }: { user: UserProfile }) {
  // ...
}

// 상수는 UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
```

### React 컴포넌트

```tsx
// 함수형 컴포넌트 사용
export function Button({ 
  children, 
  onClick, 
  variant = 'primary' 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium',
        variants[variant]
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Props 인터페이스 정의
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}
```

### Tailwind CSS

```tsx
// 클래스 순서: 위치 → 크기 → 색상 → 기타
<div className="absolute top-0 left-0 w-full h-screen bg-white dark:bg-gray-900 overflow-hidden">

// 반응형 디자인: 모바일 우선
<div className="text-sm md:text-base lg:text-lg">

// 조건부 클래스는 cn() 유틸리티 사용
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  hasError && 'error-classes'
)}>
```

## 커밋 메시지 가이드

### 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드 업무, 패키지 매니저 설정 등

### 예시

```
feat(auth): add social login with Google

- Implement Google OAuth integration
- Add login button component
- Update auth context with social providers

Closes #123
```

## Pull Request 프로세스

### 1. PR 생성 전 체크리스트

- [ ] 코드가 린트 규칙을 통과했는가?
- [ ] 모든 테스트가 통과했는가?
- [ ] 타입 체크가 성공했는가?
- [ ] 빌드가 성공하는가?
- [ ] 관련 문서를 업데이트했는가?

### 2. PR 템플릿

```markdown
## 개요
이 PR이 해결하는 문제나 추가하는 기능을 간단히 설명해주세요.

## 변경사항
- 주요 변경사항 1
- 주요 변경사항 2

## 테스트
어떻게 테스트했는지 설명해주세요.

## 스크린샷 (UI 변경시)
변경 전후 스크린샷을 첨부해주세요.

## 체크리스트
- [ ] 코드 리뷰를 요청하기 전에 self-review를 했습니다
- [ ] 관련 이슈를 연결했습니다
- [ ] 문서를 업데이트했습니다
- [ ] 테스트를 추가/업데이트했습니다

Closes #이슈번호
```

### 3. 코드 리뷰

- 모든 PR은 최소 1명의 리뷰어 승인이 필요합니다
- 리뷰 코멘트에 적극적으로 응답합니다
- 요청된 변경사항을 반영합니다

## 이슈 보고

### 버그 리포트

```markdown
## 버그 설명
버그에 대한 명확하고 간결한 설명

## 재현 방법
1. '...'로 이동
2. '...'를 클릭
3. '...'까지 스크롤
4. 오류 확인

## 예상 동작
예상했던 동작에 대한 설명

## 스크린샷
해당하는 경우 스크린샷 첨부

## 환경
- OS: [예: macOS 14.0]
- 브라우저: [예: Chrome 120]
- Node 버전: [예: 20.10.0]
```

### 기능 제안

```markdown
## 기능 설명
제안하는 기능에 대한 명확한 설명

## 현재 문제점
이 기능이 해결하려는 문제점

## 제안하는 해결책
어떻게 구현할 수 있을지에 대한 아이디어

## 대안
고려한 다른 대안들

## 추가 정보
기능 제안과 관련된 추가 정보나 참고 자료
```

## 도움 받기

- [프로젝트 위키](https://github.com/koreankennedy/mediinside-v3/wiki)
- [디스코드 채널](https://discord.gg/mediinside)
- 이메일: dev@mediinside.com

## 라이선스

기여한 코드는 프로젝트의 라이선스를 따릅니다.