# MediInside MVP v3.0

의료 인력 채용 플랫폼 MVP

---

## 버전 정보

### 현재 버전: v3.0 (2026-01-01)

**주요 변경사항:**
- **업무환경 UI 전면 개편**: 4단계 구성 (시설 → 근무 → 인력 → 장비)
- **장비 선택 시스템**: 13개 진료과별 대표 장비 + 직접 입력
- **칸반 UI 개선**: 색상 단순화, 폰트 계층 정리, 스크롤 버튼 추가
- **실시간 채용현황**: 구체적 알림 메시지 (연봉 정보 제외)
- **프로필 공개 범위**: 과거/재직 병원 숨김 옵션
- **리뷰 마스킹 요청**: 동료 리뷰 수정 요청 기능
- **조건 간단 수정**: 정밀진단 없이 희망조건 바로 수정

**배포 URL:** https://mvp-v3-self.vercel.app (별도 프로젝트)

---

### 이전 버전: v2.0 (mediinside.vercel.app)

**주요 기능:**
- AI 인터뷰 워크플로우 (이력서 → 경력검증 → 모의면접 → AI면접 → 컨시어지)
- 매칭 센터 (제안/관심/거절)
- AI 진단 (Fit Test)
- 구인처 브랜딩, 채용공고, 후보자 관리

**배포 URL:** https://mediinside.vercel.app

**롤백 필요 시:** 이 버전으로 복구 가능

---

## 소개

MediInside는 의료 분야 구직자와 구인처를 연결하는 AI 기반 채용 플랫폼입니다. 피부과, 성형외과 등 의료 기관과 간호사, 의료인력 간의 효율적인 매칭을 제공합니다.

## 스크린샷

<p align="center">
  <img src="./public/screenshots/seeker-home.png" width="200" alt="구직자 홈" />
  <img src="./public/screenshots/employer-home.png" width="200" alt="구인처 홈" />
  <img src="./public/screenshots/seeker-matching.png" width="200" alt="매칭 센터" />
  <img src="./public/screenshots/seeker-ai-interview.png" width="200" alt="AI 인터뷰" />
</p>

| 구직자 홈 | 구인처 홈 | 매칭 센터 | AI 인터뷰 |
|:---:|:---:|:---:|:---:|
| 맞춤 일자리 추천 | 후보자 현황 | 병원 매칭 리스트 | 면접 워크플로우 |

## 주요 기능

### 구직자 (Seeker)
- **AI 인터뷰 워크플로우**: 이력서 제출 → 경력 검증 → 모의면접 → AI 면접 → AI 컨시어지
- **AI 진단 (Fit Test)**: 성향 분석을 통한 맞춤형 직장 추천
- **매칭 센터**: 병원 제안 확인, 관심 표시, 거절 기능 (거절 횟수 제한)
- **프로필 관리**: 공개 범위 설정, 리뷰 마스킹 요청
- **실시간 채용현황**: 채용 성사, AI면접 진행, 연봉협상 등 알림

### 구인처 (Employer)
- **후보자 관리**: AI 매칭 기반 인재 탐색 및 칸반 파이프라인
- **AI 인터뷰**: 면접 코파일럿, 채용공고 작성, 오퍼 발송
- **병원 프로필**: 업무환경 4단계 입력 (시설/근무/인력/장비)
- **브랜딩**: 병원 브랜드 진단 및 개선
- **매칭 센터**: 후보자 풀 프로필 확인, 제안, 조율

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── employer/          # 구인처 페이지
│   │   ├── ai-interview/  # AI 인터뷰 (파이프라인, 코파일럿 등)
│   │   ├── branding/      # 브랜딩 진단
│   │   ├── candidates/    # 후보자 관리
│   │   ├── matching-center/ # 매칭 센터
│   │   ├── profile/       # 병원 프로필 (업무환경 4단계)
│   │   └── ...
│   ├── seeker/            # 구직자 페이지
│   │   ├── ai-interview/  # AI 인터뷰 워크플로우
│   │   ├── fit-test/      # AI 성향 진단
│   │   ├── matching-center/ # 매칭 센터
│   │   ├── profile/       # 프로필 (공개 범위 설정)
│   │   └── ...
│   └── globals.css        # 전역 스타일
├── components/
│   ├── layout/            # 레이아웃 컴포넌트
│   └── ui/                # UI 컴포넌트
├── lib/
│   └── mock/              # Mock 데이터
├── stores/                # Zustand 스토어
└── types/                 # TypeScript 타입
```

## 배포 버전

| 버전 | 배포 URL | 상태 | 비고 |
|:---:|:---|:---:|:---|
| v3.0 | https://mvp-v3-self.vercel.app | **현재** | 법무 검토 중 |
| v2.0 | https://mediinside.vercel.app | 안정 | 롤백 가능 |

## 라이선스

Private - All rights reserved
