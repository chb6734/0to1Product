# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - img [ref=e6]
    - generic [ref=e9]:
      - heading "FAN:STAGE에 오신 것을 환영합니다" [level=1] [ref=e10]
      - paragraph [ref=e11]: 소셜 계정으로 간편하게 시작하세요
    - generic [ref=e12]:
      - button "Google 계정으로 계속하기" [active] [ref=e13] [cursor=pointer]:
        - img [ref=e14]
        - generic [ref=e19]: Google 계정으로 계속하기
      - button "카카오로 계속하기" [ref=e20] [cursor=pointer]:
        - img [ref=e21]
        - generic [ref=e23]: 카카오로 계속하기
      - button "Apple로 계속하기" [ref=e24] [cursor=pointer]:
        - img [ref=e25]
        - generic [ref=e27]: Apple로 계속하기
    - paragraph [ref=e28]:
      - text: 계속 진행하면 FAN:STAGE의
      - link "이용약관" [ref=e29] [cursor=pointer]:
        - /url: "#"
      - text: 및
      - link "개인정보처리방침" [ref=e30] [cursor=pointer]:
        - /url: "#"
      - text: 에 동의하는 것으로 간주됩니다.
```