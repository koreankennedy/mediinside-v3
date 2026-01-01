# 매칭센터 가이드

구직자 매칭센터의 주요 기능과 사용자 플로우를 설명합니다.

---

## 개요

매칭센터는 구직자가 AI가 추천한 병원 리스트를 확인하고 평가하는 핵심 화면입니다.

**경로**: `/seeker/matching-center`

---

## 탭 필터

### 탭 순서
1. **전체**: 모든 매칭 리스트 (10개)
2. **진행 중**: 면접 진행 중인 병원 (status: 'negotiating')
3. **원장님 오퍼**: 원장님이 직접 선택한 병원 (isActive: true)
4. **인터뷰 요청**: 구직자가 관심 표시한 병원

### 진행 중 탭 강조
- 불꽃 이모지 표시
- 파란색 테두리 + 배경
- animate-pulse 효과

---

## 카드 정렬 순서

1. **진행 중** (status === 'negotiating')
2. **원장님 오퍼** (isActive === true)
3. **매칭점수순 / 급여순 / 최신순** (사용자 선택)

---

## 거절 횟수 시스템

### 제한
- **일일 거절 횟수**: 10회
- **초기값**: 0회 (10회 모두 사용 가능)

### UI 표시
- **버튼 하단**: 잔여 횟수 표시
- **3회 이하**: 상단 경고 배너 (warning 색상)
- **0회**: 상단 경고 배너 (error 색상) + 초기화 버튼

### 거절 사유 선택
```
1. 급여가 맞지 않아요
2. 출퇴근 거리가 너무 멀어요
3. 근무시간이 맞지 않아요
4. 다른 병원과 비교 중이에요
5. 추가 메시지 (선택 입력)
```

---

## 거절 10회 완료 시

### 선택 모달 표시
두 가지 옵션 중 선택:

1. **AI 모의면접 보러가기**
   - `/seeker/ai-interview/practice`로 이동

2. **매칭 더 받기**
   - 리셋 모달 표시 (4가지 CTA)

### 리셋 CTA 옵션
| 옵션 | 설명 | 이동 경로 |
|:---|:---|:---|
| 프로필 업데이트 | 이력서 최신화 | `/seeker/profile/edit` |
| 친구 초대하기 | 동료 초대 | 초대 링크 복사 |
| 원장님 초대하기 | 원장님 초대 | 초대 링크 발송 |
| 재직경험 공유하기 | 병원 리뷰 작성 | `/seeker/profile?section=workExperience` |

---

## 빈 화면 상태

모든 매칭을 평가하면 빈 화면 표시:

### 구성 요소
1. **카운트다운 타이머**
   - 24시간부터 1초씩 감소
   - 실시간 업데이트

2. **CTA 버튼**
   - AI 모의면접 연습하기 (그라데이션 강조)
   - 지금 바로 매칭 더 받기 (큰 사이즈)

---

## 모의면접 팝업

### 트리거 조건
- 세션 내 10개 평가 완료 시
- 초기 likedOffers와 무관 (실제 액션만 카운트)

### 팝업 내용
- AI 모의면접 시작하기
- 매칭 더 받기 → 리셋 모달
- 다음에 할게요

---

## 파일 구조

```
src/app/seeker/matching-center/
└── page.tsx          # 메인 컴포넌트 (2800+ lines)
```

### 주요 상태
```typescript
// 거절 관련
const [dailyRejectCount, setDailyRejectCount] = useState(0);
const [isRejectLimited, setIsRejectLimited] = useState(false);
const [showRejectCompleteModal, setShowRejectCompleteModal] = useState(false);

// 평가 카운트
const [sessionEvaluationCount, setSessionEvaluationCount] = useState(0);

// 카운트다운
const [countdown, setCountdown] = useState({ hours: 24, minutes: 0, seconds: 0 });

// 모달
const [showResetModal, setShowResetModal] = useState(false);
const [showEvaluationCompleteModal, setShowEvaluationCompleteModal] = useState(false);
```

---

## 관련 문서

- [변경 이력](./CHANGELOG.md)
- [README](../README.md)
