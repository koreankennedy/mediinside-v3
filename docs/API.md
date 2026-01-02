# MediInside API Documentation

> MediInside MVP v3.0 API 문서

## 목차

- [개요](#개요)
- [인증](#인증)
- [공통 응답 형식](#공통-응답-형식)
- [API 엔드포인트](#api-엔드포인트)
  - [인증 API](#인증-api)
  - [구직자 API](#구직자-api)
  - [구인처 API](#구인처-api)
  - [매칭 API](#매칭-api)
  - [AI 서비스 API](#ai-서비스-api)
- [에러 코드](#에러-코드)
- [Rate Limiting](#rate-limiting)

## 개요

MediInside API는 RESTful 방식으로 설계되었으며, JSON 형식으로 데이터를 주고받습니다.

### Base URL

```
Production: https://api.mediinside.com/v1
Development: http://localhost:3000/api
```

### 요청 헤더

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

## 인증

### JWT 토큰 기반 인증

모든 API 요청은 Authorization 헤더에 JWT 토큰을 포함해야 합니다.

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 토큰 만료

- Access Token: 1시간
- Refresh Token: 30일

## 공통 응답 형식

### 성공 응답

```json
{
  "success": true,
  "data": {
    // 응답 데이터
  },
  "message": "요청이 성공적으로 처리되었습니다."
}
```

### 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {}
  }
}
```

## API 엔드포인트

### 인증 API

#### 회원가입

```http
POST /api/auth/signup
```

**요청 본문:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "userType": "seeker" | "employer",
  "profile": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "licenseType": "nurse" | "doctor" | "therapist",  // seeker only
    "licenseNumber": "12345",  // seeker only
    "hospitalName": "서울의료원",  // employer only
    "businessNumber": "123-45-67890"  // employer only
  }
}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "userType": "seeker"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 로그인

```http
POST /api/auth/login
```

**요청 본문:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "userType": "seeker" | "employer"
}
```

#### 토큰 갱신

```http
POST /api/auth/refresh
```

**요청 본문:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 로그아웃

```http
POST /api/auth/logout
Authorization: Bearer {access_token}
```

### 구직자 API

#### 매칭 핏 진단 제출

```http
POST /api/seeker/fit-test
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "answers": [
    { "questionId": 1, "answer": 1 },
    { "questionId": 2, "answer": 3 },
    // ... 25개 문항
  ]
}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "fitType": "trust_expert",  // 신뢰 중심 전문가
    "coordinates": {
      "x": -0.3,  // 내적 보상 지향
      "y": -0.5   // 안정 지향
    },
    "description": "좋은 동료와 안정적인 환경을 중시하는 유형",
    "recommendedDepartments": [
      { "name": "정형외과", "matchRate": 78 },
      { "name": "내과", "matchRate": 72 },
      { "name": "가정의학과", "matchRate": 68 }
    ]
  }
}
```

#### 프로필 조회

```http
GET /api/seeker/profile
Authorization: Bearer {access_token}
```

#### 프로필 수정

```http
PUT /api/seeker/profile
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "basicInfo": {
    "name": "홍길동",
    "phone": "010-1234-5678",
    "region": ["서울", "경기"],
    "workType": ["full_time", "part_time"]
  },
  "career": [
    {
      "hospitalName": "서울대병원",
      "department": "내과",
      "position": "간호사",
      "startDate": "2020-03-01",
      "endDate": "2023-02-28",
      "description": "3년간 내과 병동 근무"
    }
  ],
  "skills": ["정맥주사", "심전도", "인공호흡기", "투석"],
  "preferences": {
    "salaryMin": 3000,
    "salaryMax": 4000,
    "workIntensity": "medium",
    "priorities": ["salary", "work_life_balance", "growth"]
  },
  "visibility": {
    "public": true,
    "hideFromHospitals": ["hospital_123", "hospital_456"]
  }
}
```

#### 매칭 리스트 조회

```http
GET /api/seeker/matches?status=all&page=1&limit=20&sort=matchScore
Authorization: Bearer {access_token}
```

**쿼리 파라미터:**

- `status`: all | active | interested | in_progress | rejected
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 20, 최대: 100)
- `sort`: matchScore | salary | distance | recent

**응답:**

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "match_123",
        "hospitalId": "hospital_456",
        "hospitalName": "서울의료원",
        "department": "정형외과",
        "jobTitle": "병동 간호사",
        "salaryRange": {
          "min": 3500,
          "max": 4200
        },
        "workIntensity": {
          "tier": 2,
          "label": "보통",
          "source": "user_review"
        },
        "matchScore": 92,
        "matchReasons": [
          "희망 연봉 범위 일치",
          "선호 지역 일치",
          "경력 요구사항 충족"
        ],
        "status": "active",
        "isDirectOffer": true,
        "offeredAt": "2026-01-02T10:00:00Z",
        "expiresAt": "2026-01-09T23:59:59Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 98,
      "itemsPerPage": 20
    }
  }
}
```

#### 매칭 응답

```http
POST /api/seeker/matches/{matchId}/response
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "action": "accept" | "reject" | "interested",
  "message": "관심 있습니다. 근무 조건에 대해 더 알고 싶습니다." // optional
}
```

### 구인처 API

#### 채용 프로젝트 생성

```http
POST /api/employer/projects
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "title": "정형외과 간호사 채용",
  "department": "orthopedics",
  "positions": 2,
  "deadline": "2026-02-01",
  "jobDetails": {
    "jobTitle": "병동 간호사",
    "workType": "full_time",
    "workSchedule": {
      "days": ["mon", "tue", "wed", "thu", "fri"],
      "shiftType": "3_shift",
      "hours": {
        "day": "07:00-15:00",
        "evening": "15:00-23:00",
        "night": "23:00-07:00"
      }
    },
    "salary": {
      "min": 3500,
      "max": 4200,
      "includesIncentive": true
    }
  },
  "requirements": {
    "licenseType": ["nurse"],
    "minExperience": 2,
    "requiredSkills": ["정맥주사", "심전도"],
    "preferredSkills": ["인공호흡기", "투석"],
    "education": "college_2year",
    "locationRadius": 10  // km
  },
  "benefits": [
    "기숙사 제공",
    "식대 지원",
    "야간 수당",
    "명절 상여금",
    "퇴직금"
  ],
  "aiSettings": {
    "autoScout": true,
    "dailyLimit": 50,
    "preferredFitTypes": ["growth_achiever", "trust_expert"]
  }
}
```

#### 병원 프로필 업데이트 (4단계)

```http
PUT /api/employer/profile
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "step1_facility": {
    "hospitalType": "general_hospital",
    "beds": 300,
    "location": {
      "address": "서울시 강남구 테헤란로 123",
      "coordinates": {
        "lat": 37.123456,
        "lng": 127.123456
      }
    },
    "parking": {
      "available": true,
      "free": true,
      "spaces": 100
    },
    "publicTransport": {
      "subway": ["강남역 3번 출구 도보 5분"],
      "bus": ["146, 341, 360번 버스"]
    }
  },
  "step2_work": {
    "workSchedule": {
      "type": "3_shift",
      "overtime": "average",
      "holidayWork": "rotation"
    },
    "vacation": {
      "annualDays": 15,
      "summerVacation": true,
      "refreshLeave": false
    },
    "benefits": [
      "4대보험",
      "퇴직금",
      "명절 상여금",
      "야간 수당",
      "주말 수당"
    ]
  },
  "step3_team": {
    "departments": [
      {
        "name": "정형외과",
        "doctors": 5,
        "nurses": 20,
        "staff": 10
      }
    ],
    "culture": {
      "teamwork": "collaborative",
      "communication": "horizontal",
      "averageAge": 32
    },
    "training": {
      "orientation": "2weeks",
      "mentoring": true,
      "education": ["monthly", "external_support"]
    }
  },
  "step4_equipment": {
    "department": "orthopedics",
    "equipments": [
      {
        "category": "imaging",
        "items": ["C-arm", "MRI 3.0T", "CT 128채널"]
      },
      {
        "category": "surgery",
        "items": ["관절경", "미세현미경", "네비게이션"]
      },
      {
        "category": "other",
        "customItems": ["최신 정형외과 수술 장비 일체"]
      }
    ],
    "lastUpdated": "2025-12-01"
  }
}
```

#### 후보자 파이프라인 조회

```http
GET /api/employer/projects/{projectId}/pipeline
Authorization: Bearer {access_token}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "pipeline": {
      "proposed": {
        "count": 25,
        "candidates": [/* ... */]
      },
      "reviewing": {
        "count": 12,
        "candidates": [/* ... */]
      },
      "interview_scheduled": {
        "count": 5,
        "candidates": [/* ... */]
      },
      "in_negotiation": {
        "count": 3,
        "candidates": [/* ... */]
      },
      "offer_sent": {
        "count": 1,
        "candidates": [/* ... */]
      },
      "hired": {
        "count": 0,
        "candidates": []
      }
    },
    "statistics": {
      "totalCandidates": 46,
      "conversionRate": {
        "proposed_to_reviewing": 48,
        "reviewing_to_interview": 42,
        "interview_to_offer": 20,
        "offer_to_hired": 0
      },
      "avgTimeInStage": {
        "proposed": 2.5,
        "reviewing": 1.2,
        "interview_scheduled": 3.0,
        "in_negotiation": 2.0
      }
    }
  }
}
```

#### 후보자 상태 업데이트

```http
PUT /api/employer/candidates/{candidateId}/status
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "status": "reviewing" | "interview_scheduled" | "in_negotiation" | "offer_sent" | "hired" | "rejected",
  "notes": "우수한 경력, 면접 일정 조율 중",
  "interviewDate": "2026-01-05T14:00:00Z",  // if interview_scheduled
  "rejectionReason": "경력 부족"  // if rejected
}
```

### 매칭 API

#### AI 매칭 점수 계산

```http
POST /api/matching/calculate
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "seekerId": "seeker_123",
  "projectId": "project_456"
}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "matchScore": 85,
    "breakdown": {
      "skillMatch": 90,
      "experienceMatch": 85,
      "locationMatch": 95,
      "salaryMatch": 80,
      "fitTypeMatch": 75
    },
    "strengths": [
      "필수 술기 모두 보유",
      "희망 지역 일치",
      "유사 병원 경력 3년"
    ],
    "weaknesses": [
      "희망 연봉보다 10% 낮음",
      "성향 유형 부분 일치"
    ],
    "recommendation": "strong_match"
  }
}
```

### AI 서비스 API

#### AI 컨시어지 대화

```http
POST /api/ai/concierge/chat
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "hospitalId": "hospital_123",
  "message": "이 병원의 야간 근무는 어떻게 되나요?",
  "conversationId": "conv_789"  // optional, for continuing conversation
}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "conversationId": "conv_789",
    "reply": "서울의료원 정형외과는 3교대 근무 시스템을 운영하고 있습니다. 야간 근무는 23:00부터 다음날 07:00까지이며, 월 평균 8-10회 정도입니다. 야간 근무 수당은 기본급의 50%가 추가로 지급됩니다.",
    "extractedInfo": {
      "skills": [],
      "preferences": {
        "concerns": ["night_shift"]
      }
    },
    "suggestedQuestions": [
      "야간 근무 후 휴무는 어떻게 되나요?",
      "야간 전담 간호사 제도가 있나요?",
      "신규 간호사도 바로 야간 근무를 하나요?"
    ]
  }
}
```

#### 조건 역제안

```http
POST /api/ai/concierge/negotiate
Authorization: Bearer {access_token}
```

**요청 본문:**

```json
{
  "matchId": "match_123",
  "proposal": {
    "salary": {
      "current": 3500,
      "requested": 3800,
      "reason": "3년 경력과 전문 술기를 고려해 주세요"
    },
    "workSchedule": {
      "currentNightShifts": 10,
      "requestedNightShifts": 7,
      "reason": "건강상의 이유로 야간 근무를 줄이고 싶습니다"
    }
  }
}
```

#### AI 면접 질문 추천

```http
GET /api/ai/interview/questions/{candidateId}
Authorization: Bearer {access_token}
```

**응답:**

```json
{
  "success": true,
  "data": {
    "candidate": {
      "name": "김간호",
      "experience": "3년",
      "skills": ["정맥주사", "심전도", "인공호흡기"]
    },
    "recommendedQuestions": [
      {
        "category": "경력 검증",
        "question": "이전 병원에서 응급 상황 대처 경험이 있으신가요?",
        "followUp": "구체적인 사례를 들어 설명해 주세요."
      },
      {
        "category": "기술 역량",
        "question": "인공호흡기 관리 경험에 대해 설명해 주세요.",
        "followUp": "어려웠던 케이스가 있었나요?"
      },
      {
        "category": "팀워크",
        "question": "의료진 간 의견 충돌이 있을 때 어떻게 대처하시나요?",
        "followUp": "실제 경험이 있다면 공유해 주세요."
      },
      {
        "category": "성장 의지",
        "question": "정형외과에서 추가로 배우고 싶은 술기가 있나요?",
        "followUp": "어떤 방식으로 학습하실 계획인가요?"
      }
    ]
  }
}
```

## 에러 코드

### 인증 관련

| 코드 | HTTP Status | 설명 |
|-----|-------------|------|
| AUTH_INVALID_CREDENTIALS | 401 | 잘못된 이메일 또는 비밀번호 |
| AUTH_TOKEN_EXPIRED | 401 | 토큰 만료 |
| AUTH_TOKEN_INVALID | 401 | 유효하지 않은 토큰 |
| AUTH_UNAUTHORIZED | 403 | 권한 없음 |

### 유효성 검사

| 코드 | HTTP Status | 설명 |
|-----|-------------|------|
| VALIDATION_ERROR | 400 | 입력 값 검증 실패 |
| INVALID_REQUEST_FORMAT | 400 | 잘못된 요청 형식 |
| MISSING_REQUIRED_FIELD | 400 | 필수 필드 누락 |

### 리소스 관련

| 코드 | HTTP Status | 설명 |
|-----|-------------|------|
| RESOURCE_NOT_FOUND | 404 | 리소스를 찾을 수 없음 |
| RESOURCE_ALREADY_EXISTS | 409 | 이미 존재하는 리소스 |
| RESOURCE_CONFLICT | 409 | 리소스 충돌 |

### 서버 에러

| 코드 | HTTP Status | 설명 |
|-----|-------------|------|
| INTERNAL_SERVER_ERROR | 500 | 서버 내부 오류 |
| SERVICE_UNAVAILABLE | 503 | 서비스 일시 중단 |

## Rate Limiting

API 요청 제한이 적용됩니다:

### 일반 사용자

- 분당 60회 요청
- 시간당 600회 요청
- 일일 10,000회 요청

### 구인처 (프리미엄)

- 분당 120회 요청
- 시간당 1,200회 요청
- 일일 20,000회 요청

### Rate Limit 헤더

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1641024000
```

제한 초과 시:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "요청 한도를 초과했습니다. 60초 후에 다시 시도해주세요.",
    "retryAfter": 60
  }
}
```

---

## 문의

API 관련 문의사항은 다음으로 연락주세요:

- 이메일: api@mediinside.com
- 개발자 포털: https://developers.mediinside.com
- GitHub: https://github.com/mediinside/api-docs