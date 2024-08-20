# Jin's Remix Starter
다크&라이트 테마, postcss와 SCSS, i18next, styled-components, remix-development-tools, recoil, eslint, husky, remix-validated-form과 yup이 적용되어 있는 remix starter 탬플릿입니다.

## 설치
로컬에 기본적으로 18버전 이상의 node.js가 설치되어 있어야합니다.
패키지 매니저로는 yarn 사용을 권장합니다.

yarn이 없는 경우 아래 커맨드로 전역 패키지로 설치
```bash
npm i -g yarn
```

패키지 설치하기
```bash
yarn
```

환경 변수를 설정합니다. 아래 커맨드로 .env.example을 복사하여 .env 파일을 복사하여 만들어 줍니다.
```bash
cp .env.example .env
```

.env를 개발 환경에 맞게 수정해줍니다.

## 실행 및 배포
### 개발 환경 실행
```bash
yarn dev
```

### 배포 전 빌드
```bash
yarn build
```

### 배포 앱 실행
참고: 배포(production) 환경에서 .env 파일의 환경 변수는 더 이상 불러오지 않으므로 환경 변수를 직접 생성해주어야 합니다.

```bash
yarn start
```

## 구조
```
├── app                             | app 디렉토리
│   ├── common                      | 공통 모듈 디렉토리
│   │   ├── constants.ts            | 전역 상수
│   │   └── global.d.ts             | 전역 타입
│   ├── components                  | 컴포넌트 디렉토리
│   ├── entry.client.tsx            | 클라이언트 랜더링 모듈
│   ├── entry.server.tsx            | 서버 랜더링 모듈
│   ├── hooks                       | 커스텀 훅
│   ├── localization                | react-i18next 다국어 모듈
│   ├── recoil                      | recoil 전역 상태관리
│   ├── root.tsx                    | 앱 루트 컴포넌트
│   ├── routes                      | 페이지별 라우트 컴포넌트
│   ├── services                    | 서버사이드 전용 서비스 로직
│   ├── styles                      | SCSS로 작성된 스타일은 자동 컴파일되어 이 곳에 CSS파일로 생성 됨
│   └── utils                       | 유틸리티 디렉토리
├── public                          | public 디렉토리
│   ├── build                       | 빌드된 파일은 이곳에 생성 됨
│   ├── favicon.ico                 | 파비콘
│   └── locales                     | react-i18next 다국어 디렉토리
│       ├── en                      | 영어
│       └── ko                      | 한국어
├── styles                          | .scss로 스타일 파일을 이곳에 작성 
│   ├── global.scss                 | 글로벌 스타일
│   ├── reset.scss                  | CSS 초기화
│   └── theme.scss                  | 테마 색상 스타일
├── .env.example                    | 환경변수 예제 파일
├── .eslintrc.cjs                   | eslint 설정 파일
├── .gitignore                      | git 커밋 무시 설정
├── package.json                    | package.json
├── postcss.config.js               | postcss 설정 파일
├── README.md
├── remix.config.js                 | remix 프레임워크 설정 파일
├── remix.env.d.ts
├── server.mjs                      | express.js 서버 파일
├── tsconfig.json                   | 타입스크립트 설정 파일
└── yarn.lock
```

## 가이드
### CSS
CSS는 ./styles 위치에 .scss 파일로 작성하여 추가합니다.
```scss
/* ./styles/styles.scss */
$font-stack: Pretendard Variable, sans-serif;
:root {
  font-family: $font-stack;
}
```

이후 scss 파일은 컴파일되어 ./app/styles/ 경로에 CSS 파일로 저장됩니다. 사용할 때는 이 CSS 파일을 [links](https://remix.run/docs/en/1.19.3/route/links)에 추가합니다.
```tsx
import styles from '~/styles/styles.css';

export const links: LinksFunction = () => [
  /* ... */
  { rel: 'stylesheet', href: styles },
  /* ... */
];
```

#### 다크 및 라이트 테마
다크 및 라이트 테마를 적용하는 경우 전역 CSS에 클래스를 통해 적용합니다.
```scss
/* ./styles/global.scss */
html.light {
  .some-class {
    color: $light-text-color;
  }
}
html.dark {
  .some-class {
    color: $dark-text-color;
  }
}
```

리액트 컴포넌트에서 테마의 확인과 변경은 useTheme 훅을 사용합니다.
```tsx
const [theme, setTheme] = useTheme();
```

### 다국어 현지화(localization)
다국어 언어 모델을 적용하는 경우는 ./public/locales 아래에 언어별로 json 파일로 각 텍스트를 설정합니다.
common은 기본적인 네임스페이스가 되고 json 파일의 명칭에 따라 네임스페이스가 부여됩니다.

컴포넌트에서의 적용은 아래처럼 사용합니다.
```tsx
const Component = () => {
  const { t } = useTranslation('namespace' /* 네임스페이스 없을 경우 common 기본 */);

  return <p>{t('title')}</p>;
};
```

자세한 사용법은 [react-i18next](https://react.i18next.com/) 문서를 참고하세요.
