# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - generic [ref=e5]:
      - heading "프로필 설정" [level=1] [ref=e6]
      - paragraph [ref=e7]: 닉네임과 프로필 사진을 설정해주세요
    - generic [ref=e9]:
      - generic [ref=e10]:
        - generic [ref=e12]:
          - generic [ref=e13]: "?"
          - button [ref=e14] [cursor=pointer]:
            - img [ref=e15]
        - paragraph [ref=e17]: 프로필 사진 (선택)
      - generic [ref=e18]:
        - generic [ref=e19]: 닉네임 *
        - textbox "닉네임을 입력하세요" [ref=e20]
        - paragraph [ref=e21]: 0/20
      - generic [ref=e22]:
        - generic [ref=e23]: 주로 사용하는 음악 플랫폼
        - combobox [ref=e24]:
          - option "없음 (나중에 설정)" [selected]
          - option "Spotify"
          - option "Apple Music"
          - option "YouTube Music"
          - option "멜론"
        - paragraph [ref=e25]: 편지를 받을 때 자동으로 이 플랫폼에서 재생됩니다
      - button "시작하기" [disabled] [ref=e26]
```