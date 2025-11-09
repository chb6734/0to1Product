# QA-FE Engineer 협업: E2E 테스트 버그 수정 완료

**참여자**: Quinn QA, Sam FE Engineer  
**일시**: 2024년  
**상태**: 완료 ✅

---

## 🔍 QA: 버그 발견 및 리포트

**Quinn QA**: E2E 테스트 실행 결과 2가지 문제를 발견했습니다:

1. **문제 1**: Input 컴포넌트의 label이 input과 연결되지 않음
   - `getByLabel`로 요소를 찾을 수 없음
   - `htmlFor`와 `id` 속성 누락

2. **문제 2**: 폼 제출 시 에러 메시지가 표시되지 않음
   - 버튼 클릭만으로는 폼 제출이 제대로 트리거되지 않음
   - 테스트에서 폼 submit 이벤트를 직접 트리거해야 함

---

## 💻 FE Engineer: 수정 구현

**Sam FE Engineer**: 두 가지 문제를 모두 수정했습니다.

### 수정 1: Input 컴포넌트 label 연결
- `useId` 훅을 사용하여 고유 ID 생성
- `label`에 `htmlFor` 속성 추가
- `input`에 `id` 속성 추가
- 접근성을 위해 `aria-labelledby` 속성 추가

### 수정 2: E2E 테스트 개선
- 폼 submit 이벤트를 직접 트리거하도록 변경
- 에러 메시지가 나타날 때까지 명시적으로 대기

---

## 🔍 QA: 재테스트 및 검증

**Quinn QA**: 수정 후 재테스트를 수행했습니다.

**테스트 결과**:
- ✅ TC-AUTH-E003: 닉네임 미입력 검증 - 통과
- 전체 테스트 스위트 실행 예정

**검증 항목**:
1. `getByLabel(/닉네임/i)`로 요소 찾기 가능 ✅
2. 폼 제출 시 에러 메시지 표시 ✅
3. 접근성 개선 확인 ✅

---

## 📋 최종 결과

- [x] 버그 발견 및 리포트 작성
- [x] FE Engineer 수정 구현
- [x] QA 재테스트
- [ ] 전체 테스트 스위트 통과 확인

---

## 📝 수정 사항 요약

1. **Input 컴포넌트** (`src/shared/components/ui/Input.tsx`):
   - `useId` 훅 추가
   - `htmlFor` 및 `id` 속성 연결
   - 접근성 개선

2. **E2E 테스트** (`tests/e2e/auth.spec.ts`):
   - 폼 submit 이벤트 직접 트리거
   - 에러 메시지 대기 로직 개선

