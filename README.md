# MediInside MVP v3.2

의료 인력 채용 플랫폼 MVP

---

## 버전 정보

### 현재 버전: v3.2 (2026-01-04)

**주요 변경사항:**

#### 거절횟수 글로벌 상태 버그 수정
- **useSyncExternalStore 적용**: 페이지 이동 시에도 거절 횟수 유지
- **커스텀 이벤트 동기화**: 같은 탭 내 실시간 상태 동기화

#### 병원 프로필 완성하기 CTA 개선
- **바이럴루프 팝업 → 프로필 완성도 모달**: 중간 CTA 화면 제거
- **직접 이동**: `/employer/profile?showCompletion=true`로 바로 이동

#### 재직경험 공유 기능 강화
- **서브탭 추가**: 직원 리뷰 / 원장 재직경험 분리
- **리뷰 작성 시 비밀번호 보호**: 공용 채용 계정 대응

**배포 URL:** https://mediinside-v3.vercel.app

---

### 이전 버전: v3.1 (2026-01-02)

**주요 변경사항:**
- 거절 횟수 시스템: 10회 제한, 버튼 하단에 잔여 횟수 표시
- 거절 10회 완료 시: AI 모의면접 or 매칭 더 받기 선택 모달
- 빈 화면 상태: 24시간 실시간 카운트다운 + 큰 CTA 버튼
- 진행 중 필터 강화: 탭 순서 변경, 강조 효과
- 재직경험 공유 탭 추가

---

### v3.0 (2026-01-01)

**주요 변경사항:**
- 업무환경 UI 전면 개편: 4단계 구성 (시설 → 근무 → 인력 → 장비)
- 장비 선택 시스템: 13개 진료과별 대표 장비 + 직접 입력
- 칸반 UI 개선: 색상 단순화, 폰트 계층 정리, 스크롤 버튼 추가
- 실시간 채용현황: 구체적 알림 메시지 (연봉 정보 제외)
- 프로필 공개 범위: 과거/재직 병원 숨김 옵션
- 리뷰 마스킹 요청: 동료 리뷰 수정 요청 기능

---

### v2.0 (mediinside.vercel.app)

**주요 기능:**
- AI 인터뷰 워크플로우 (이력서 → 경력검증 → 모의면접 → AI면접 → 컨시어지)
- 매칭 센터 (제안/관심/거절)
- AI 진단 (Fit Test)
- 구인처 브랜딩, 채용공고, 후보자 관리

**배포 URL:** https://mediinside.vercel.app

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
- **매칭 센터**: 병원 제안 확인, 관심 표시, 거절 기능 (10회 제한, 24시간 리셋)
- **프로필 관리**: 공개 범위 설정, 재직경험 공유, 리뷰 마스킹 요청
- **실시간 채용현황**: 채용 성사, AI면접 진행, 연봉협상 등 알림

### 구인처 (Employer)
- **후보자 관리**: AI 매칭 기반 인재 탐색 및 칸반 파이프라인
- **AI 인터뷰**: 면접 코파일럿, 채용공고 작성, 오퍼 발송
- **병원 프로필**: 업무환경 4단계 입력 (시설/근무/인력/장비)
- **브랜딩**: 병원 브랜드 진단 및 개선
- **매칭 센터**: 후보자 풀 프로필 확인, 제안, 조율

## 기술 스택

- **Framework**: Next.js 16.1.1 (App Router)
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

# Vercel 배포
npx vercel --prod
```

## 프로젝트 구조

```
src/
├── app/
│   ├── employer/              # 구인처 페이지
│   │   ├── ai-interview/      # AI 인터뷰 (파이프라인, 코파일럿 등)
│   │   ├── branding/          # 브랜딩 진단
│   │   ├── candidates/        # 후보자 관리
│   │   ├── matching-center/   # 매칭 센터
│   │   ├── profile/           # 병원 프로필 (업무환경 4단계)
│   │   └── ...
│   ├── seeker/                # 구직자 페이지
│   │   ├── ai-interview/      # AI 인터뷰 워크플로우
│   │   ├── fit-test/          # AI 성향 진단
│   │   ├── matching-center/   # 매칭 센터 (거절 제한, 빈 화면 상태)
│   │   ├── profile/           # 프로필 (재직경험 공유)
│   │   ├── home/              # 홈 (커리어 인사이트 그룹)
│   │   └── ...
│   └── globals.css            # 전역 스타일
├── components/
│   ├── layout/                # 레이아웃 컴포넌트
│   └── ui/                    # UI 컴포넌트
├── lib/
│   └── mock/                  # Mock 데이터
├── stores/                    # Zustand 스토어
└── types/                     # TypeScript 타입
```

## 배포 버전

| 버전 | 배포 URL | 상태 | 비고 |
|:---:|:---|:---:|:---|
| v3.2 | https://mediinside-v3.vercel.app | **현재** | 버그 수정 및 CTA 개선 |
| v3.1 | - | - | 매칭센터 UX 개선 |
| v3.0 | - | - | 업무환경 UI 개편 |
| v2.0 | https://mediinside.vercel.app | 안정 | 롤백 가능 |

## 문서

- [화면정의서](./docs/SCREEN_DEFINITION.md)
- [변경 이력](./docs/CHANGELOG.md)
- [매칭센터 가이드](./docs/MATCHING_CENTER.md)

## 라이선스

Private - All rights reserved
