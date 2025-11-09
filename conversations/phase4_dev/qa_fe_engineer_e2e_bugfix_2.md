# QA-FE Engineer 협업: E2E 테스트 버그 수정 (2차)

**참여자**: Quinn QA, Sam FE Engineer  
**일시**: 2024년  
**목적**: Input 컴포넌트의 label 연결 문제 해결

---

## 🔍 QA: 추가 버그 발견

**Quinn QA**: E2E 테스트를 실행한 결과, Input 컴포넌트의 label이 input과 연결되지 않아 `getByLabel`로 요소를 찾을 수 없는 문제를 발견했습니다.

**문제점**:
- `Input` 컴포넌트에서 `label` prop이 있지만 `htmlFor` 속성이 없음
- `input` 요소에 `id` 속성이 없어 label과 연결되지 않음
- Playwright의 `getByLabel`이 label과 input을 연결하지 못함

**영향받는 테스트**:
1. `TC-AUTH-E003: 닉네임 미입력 검증` ❌
2. `온보딩 페이지 UI 요소 확인` ❌
3. `닉네임 길이 제한 검증` ❌

**에러 메시지**:
```
Locator: getByLabel(/닉네임/i)
Expected: visible
Error: element(s) not found
```

---

## 💻 FE Engineer: 문제 분석 및 수정

**Sam FE Engineer**: 문제를 확인했습니다. `Input` 컴포넌트에서 label과 input을 연결하기 위해 `htmlFor`와 `id` 속성을 추가하겠습니다.

**수정 사항**:
1. `useId` 훅을 사용하여 고유 ID 생성
2. `label`에 `htmlFor` 속성 추가
3. `input`에 `id` 속성 추가
4. 접근성을 위해 `aria-labelledby` 속성 추가

**구현**:
```typescript
const generatedId = useId()
const inputId = id || generatedId
const labelId = label ? `label-${inputId}` : undefined

<label htmlFor={inputId} id={labelId}>
  {label}
</label>
<input id={inputId} aria-labelledby={labelId} />
```

---

## 🔍 QA: 재테스트 예정

**Quinn QA**: 수정 완료 후 재테스트를 수행하겠습니다.

**검증 항목**:
1. `getByLabel(/닉네임/i)`로 요소 찾기 가능한지 확인
2. 모든 E2E 테스트 통과 확인
3. 접근성 개선 확인

---

## 📋 진행 상황

- [x] 버그 발견 및 리포트 작성
- [x] FE Engineer 수정 구현
- [ ] QA 재테스트
- [ ] 모든 테스트 통과 확인

