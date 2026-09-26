# Minim 디자인·코드 시각 교차 검증

검증일: 2026-09-26. 최신 Figma를 읽고 현재 작업 트리의 production 빌드와 비교했다. 이번 검수에서는 Figma 및 컴포넌트 구현을 변경하지 않았다.

## 확인된 불일치

### 후속 반영 (2026-09-26)

- 아래 항목 2~4는 사용자 지정 기준으로 수정했다. 최초 발견 내용은 이력으로 유지한다.
- TextInput: Figma MD·LG 로딩 변형의 스피너를 텍스트 뒤로 이동했다. 코드는 기존 trailing 배치를 유지한다.
- TextInput placeholder: Figma와 코드 모두 기존 `fg/placeholder` (#9E9E9E)를 사용한다. 다른 입력 컴포넌트의 placeholder는 이번 변경 범위에 포함하지 않았다.
- Switch: Figma의 단일 크기 트랙에 맞춰 코드 Base 54×24, Compact 44×20으로 수정했다. 기존 size 속성은 호환성을 위해 유지하지만 트랙 크기를 별도로 확대하지 않는다. 손잡이는 각각 30×20, 24×16이며 1.5:1 비율을 유지한다.
- Switch 라벨: Figma에 맞춰 sm 텍스트 토큰을 사용한다. Base 13.5/18px, Compact 12/16px이다.
- 관련 단위 테스트 21개와 PC·모바일 Base·Compact 브라우저 검사 16개 통과. 스위치 두 모드 캡처도 확인했다. ButtonGroup 불일치는 이번 변경에 포함하지 않았다.

### 1. ButtonGroup 연결부 모서리와 구분선

- [Figma](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=8400-13981) / [코드 화면](http://localhost:5181/components/ButtonGroup)
- Figma: 외곽만 둥글고 안쪽 연결부는 직선이며 구분선이 보인다.
- 코드: Copy·Cut·Paste 및 Save 분할 버튼의 안쪽 모서리도 둥글다. 그룹이 이어진 하나의 컨트롤보다 개별 버튼처럼 보인다. Base·Compact에서 확인했다.
- 확인 지점: `packages/themes/minim/src/components/button.ts:34`의 radius 지정과 `packages/core/src/Button/Button.tsx:468`의 그룹별 논리 모서리 규칙. 스타일 우선순위 원인은 추가 확인이 필요하다.
- 색상은 일치한다. 최신 Figma의 neutral은 어두운 배경·흰 글자다. 기존 시각 테스트의 연한 배경 기대값은 오래된 기준이다.
- 캡처: `/tmp/minim-cross-review/ButtonGroup-base.png`, `ButtonGroup-compact.png`.

### 2. TextInput 로딩 위치

- [Figma LG](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-35739) / [Figma MD](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-35728) / [코드 화면](http://localhost:5181/components/TextInput)
- Figma: `loading-trailing`이 이름과 달리 첫 번째 자식이다. LG에서 x=12, 텍스트 x=44로 스피너가 앞에 있다.
- 코드: `TextInput.tsx:499`에서 input과 clear 버튼 뒤에 Spinner를 렌더링한다.
- DateInput·TimeInput의 Figma 로딩 변형은 아이콘 → 텍스트 → 스피너 순서로 정상이다. TextInput만 같은 기준으로 맞출 필요가 있다.

### 3. TextInput placeholder 색상

- [Figma](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10322-35578) / [코드 화면](http://localhost:5181/components/TextInput)
- Figma의 `Placeholder text`는 `fg/neutral`, #18181B다.
- 코드는 `packages/themes/minim/src/components/input.ts:170`의 `::placeholder`에 `fg-muted`를 적용한다. 실제 화면에서도 입력값보다 연한 회색이다.
- 입력값인지 placeholder인지 의미를 구분해서 Figma 상태를 맞춰야 한다. 단순히 코드의 모든 placeholder를 neutral로 바꾸는 방식은 권하지 않는다.

### 4. Switch 기본 크기 대응

- [Figma](https://www.figma.com/design/mHcauYaYWK3floQNsfolz6?node-id=10542-38124) / [코드 화면](http://localhost:5181/components/Switch)
- Figma Base: 트랙 54×24, 손잡이 30×20, 라벨 13.5px. 공개 변형에 size 축이 없다.
- 코드 기본 lg: Base 트랙 64×28, 손잡이 36×24. Compact는 54×24, 손잡이 30×20이다.
- Figma 기본형이 코드 Base 기본형이 아니라 더 작은 크기에 대응한다. md/lg 대응과 기본형을 명시해야 한다.
- 손잡이의 1.5:1 비율 자체는 양쪽이 같다. 늘어난 모양을 오류로 판정하지 않았다.
- 코드: `packages/themes/minim/src/components/selection.ts:164`, `packages/core/src/Switch/Switch.tsx:488`.

## 확인한 정상 항목

- 기본 lg 및 명시적 md/lg 높이, Base·Compact 크기 검사 통과.
- CheckboxInput 비활성 아이콘의 fg/disabled 색상 검사 통과.
- FileInput 화살표 500 웨이트, 실제 glyph 크기, 슬롯 크기, 로딩 상태 검사 통과. Figma 기본형의 글자·아이콘도 대조했다.
- Calendar Base 외곽 332×406이 Figma와 코드에서 일치. 코드 Compact는 272×330으로 축소된다. 날짜, 헤더, 선택 원의 기본형을 화면으로 확인했다. 모든 날짜 상태의 픽셀 일치를 보증하는 결과는 아니다.
- Slider 성공 안내의 primary blue, 폭 변경 시 트랙 위치, 고정 손잡이 크기 검사 통과.
- OverflowList 모바일 및 밀도 왕복 시 항목 유지 검사 통과.
- Selector 등 메뉴 열림·상태 아이콘 검사 48개 통과. Base·Compact 메뉴 화면도 확인했다.

## 검증 범위와 제한

- 코드 14종의 Base·Compact 화면 28장을 수집했다: Button, ButtonGroup, TextInput, NumberInput, Selector, Badge, Token, Switch, CheckboxInput, Slider, Calendar, FileInput, SegmentedControl, OverflowList.
- Figma의 관련 컴포넌트 세트·변형·토큰을 직접 읽고 핵심 디자인을 캡처했다. Figma 파일의 모드는 변경하지 않았다. 따라서 Compact는 코드 화면 및 크기 검사가 중심이며 모든 Figma Compact 변형의 시각 대조가 완료된 것은 아니다.
- 전체 라이브러리의 모든 변형을 검수했다는 의미는 아니다. 메뉴 단독 컴포넌트 페이지는 직접 렌더링되지 않아 `/examples/menus`의 실제 열림 화면으로 확인했다.
- 자동 검사: review-fixes 4개 통과, sizes 16개 통과, menus 48개 통과·4개 실패, 기존 visual 2개 실패.
- menus 실패 4개: DateTimeInput 예시가 추가되어 단일 요소를 기대한 선택자가 두 요소를 찾음. 결합 필드/readonly 검사는 해당 지점에서 중단되었으므로 통과로 세지 않았다.
- visual 실패 2개: ButtonGroup neutral 색상 기대값이 최신 Figma와 다름. 이 테스트는 초반에 중단되므로 이후 항목을 통과로 세지 않았다. 별도 캡처로 검수를 계속했다.
- 측정값: `/tmp/minim-cross-review/metrics.json`. 코드 캡처: `/tmp/minim-cross-review/`. 메뉴 캡처: `/tmp/minim-menus/`.
