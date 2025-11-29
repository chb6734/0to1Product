# TPM-FE Engineer 인증 프로필 지속성 개선 대화

**참여자**: Alex TPM, Sam FE Engineer  
**작성 일시**: 2024년  
**목적**: 로그인 후 프로필 정보가 로그아웃까지 유지되도록 개선

---

## 요구사항

사용자 요청:
- 백엔드가 없으므로 로그인 버튼을 눌러서 SNS 버튼을 누르면 API를 호출했다고 가정
- 프로필 설정을 하면 그 프로필이 로그아웃될 때까지 계속 남아있었으면 좋겠다

---

## 현재 구현 상태 분석

### ⚙️ TPM: 현재 아키텍처 분석

현재 `useAuth` 훅의 구현을 확인한 결과:

**장점**:
1. ✅ localStorage를 사용하여 사용자 정보 저장
2. ✅ `useEffect`를 통해 user 상태 변경 시 자동으로 localStorage 동기화
3. ✅ 로그아웃 시 localStorage 삭제

**개선 필요 사항**:
1. ⚠️ 프로필 업데이트 시 localStorage 동기화가 명시적이지 않음
2. ⚠️ 로그아웃 시 localStorage 삭제가 확실하지 않을 수 있음
3. ⚠️ 페이지 새로고침 시 프로필 정보 복원 로직 확인 필요

---

## 기술적 구현 방안

### 💻 FE Engineer: 구현 개선 사항

**1. 프로필 업데이트 시 localStorage 명시적 동기화**

현재 `updateProfile` 함수에서 `setUser(updatedUserData)`를 호출하면 `useEffect`에서 자동으로 localStorage에 저장됩니다. 하지만 더 명시적으로 처리하는 것이 좋습니다.

**2. 로그아웃 시 localStorage 완전 삭제**

현재 `logout` 함수에서 `setUser(null)`을 호출하면 `useEffect`에서 localStorage를 삭제합니다. 하지만 명시적으로 삭제하는 것이 더 안전합니다.

**3. localStorage 동기화 이벤트 발생**

다른 컴포넌트에서 localStorage를 직접 수정하는 경우를 대비하여 커스텀 이벤트를 발생시켜 `useAuth`가 변경사항을 감지하도록 합니다.

---

## 구현 계획

### 1. 프로필 업데이트 개선
- `updateProfile` 함수에서 localStorage를 명시적으로 업데이트
- `localStorageChange` 이벤트 발생하여 다른 컴포넌트에 알림

### 2. 로그아웃 개선
- `logout` 함수에서 localStorage를 명시적으로 삭제
- 모든 관련 localStorage 항목 삭제 (defaultPlatform 등)

### 3. 초기화 로직 개선
- 페이지 로드 시 localStorage에서 프로필 정보 복원
- 프로필 정보가 있으면 로그인 상태로 복원

---

## 구현 세부사항

### localStorage 키 관리
- `fanstage_auth_user`: 사용자 프로필 정보
- `fanstage_default_platform`: 기본 플랫폼 (선택적, user 객체에 포함 가능)

### 프로필 정보 구조
```typescript
interface User {
  id: string;
  email: string;
  nickname?: string;
  profileImage?: string;
  defaultPlatform?: 'spotify' | 'apple' | 'youtube' | 'melon' | null;
}
```

### 로그인 플로우
1. SNS 로그인 버튼 클릭
2. API 호출 (`/api/auth/login/{provider}`)
3. 응답으로 받은 사용자 정보를 localStorage에 저장
4. 프로필 정보가 없으면 온보딩 페이지로 이동
5. 프로필 정보가 있으면 보관함으로 이동

### 프로필 업데이트 플로우
1. 온보딩 페이지에서 프로필 정보 입력
2. `updateProfile` 호출
3. API 호출 (`/api/auth/profile`)
4. 응답으로 받은 업데이트된 사용자 정보를 localStorage에 저장
5. `localStorageChange` 이벤트 발생

### 로그아웃 플로우
1. 로그아웃 버튼 클릭
2. `logout` 호출
3. localStorage에서 모든 사용자 관련 정보 삭제
4. 로그인 페이지로 리다이렉트

---

## 다음 단계

1. ✅ `useAuth` 훅 개선
2. ✅ `updateProfile` 함수 개선
3. ✅ `logout` 함수 개선
4. ✅ 초기화 로직 확인

---

**작성 완료일**: 2024년  
**다음 단계**: 코드 구현 및 테스트

