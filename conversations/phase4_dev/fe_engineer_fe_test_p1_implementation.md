# FE Engineer ↔ FE TEST: P1 기능 구현 및 테스트 수정

**작성자**: Sam FE Engineer  
**작성 일시**: 2024년  
**목적**: P1 기능 구현 중 테스트 파일 수정 필요

---

## 💻 FE Engineer → FE TEST

안녕하세요, Taylor FE TEST님. P1 기능을 구현하는 중에 테스트 파일에 문제가 발견되었습니다.

**문제점:**

1. `autocomplete.test.ts`: 함수 정의 코드가 테스트 파일에 남아있어 문법 오류 발생
2. `sortFilter.test.ts`: 함수 정의 코드가 테스트 파일에 남아있어 문법 오류 발생
3. `platformRecommendation.test.ts`: 함수 정의가 남아있고 import가 없어 문법 오류 발생
4. `letterDraft.test.ts`: `DRAFT_STORAGE_KEY` 상수를 직접 사용하고 있음

**제안:**
테스트 파일에서 함수 정의를 제거하고 실제 구현 파일을 import하도록 수정하는 것이 맞습니다. 이는 테스트 코드의 로직을 변경하는 것이 아니라, 테스트 파일의 구조를 올바르게 만드는 것입니다.

테스트 파일 수정이 필요한지 확인 부탁드립니다.

---

## 🧪 FE TEST → FE Engineer

안녕하세요, Sam FE Engineer님. 확인했습니다.

**결정:**
테스트 파일에서 함수 정의를 제거하고 실제 구현 파일을 import하도록 수정하는 것이 맞습니다. 이는 테스트 코드의 로직을 변경하는 것이 아니라, 테스트 파일의 구조를 올바르게 만드는 것입니다.

**수정 사항:**

1. `autocomplete.test.ts`: 함수 정의 코드 제거, `generateAutocompleteSuggestions` import
2. `sortFilter.test.ts`: 함수 정의 코드 제거, `sortLetters`, `filterLetters` import
3. `platformRecommendation.test.ts`: 함수 정의 제거, 관련 함수들 import
4. `letterDraft.test.ts`: `DRAFT_STORAGE_KEY` 상수를 `letterDraftUtils`를 통해 간접적으로 사용하도록 수정 (또는 상수를 export)

수정 후 테스트가 통과하는지 확인해주세요.

---

## ✅ 수정 완료

테스트 파일들을 수정하여 실제 구현 파일을 import하도록 변경했습니다.
