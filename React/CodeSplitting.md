# Code splitting

## Code splitting이 필요한 이유

React는 SPA(Single Page Application)이다.

SPA의 초기에 앱에 필요한 모든 파일을 가져오는 특징이 있는데, 이렇게 되면 초기 로딩 시간이 길어진다. 작은 앱의 경우에는 괜찮을 수 있지만, 규모가 큰 앱의 경우 초기에 모든 js 파일을 가져오려면 오랜 시간이 걸려 사용자가 떠날 수 있다는 문제로 이어진다. 

따라서 SPA 개발을 할 때 하나의 js파일로 번들링 하는게 아니라, js 파일을 나눠서 번들링 해서 필요할 때 불러오도록 code splitting을 한다.

## Lazy & Suspense

React에서는 code splitting을 위해 lazy와 Suspense를 제공해준다.

## 사용 방법

lazy 함수에 callback함수로 동적 import를 넣어준다. lazy는 Suspense component로 감싸고 fallback에는 동적 import되는 동안, 즉 로딩되는 동안 render할 component를 넣어주면 된다.

**App.js**
```
import React, { lazy, Suspense } from 'react';

const Example = lazy(() => import('./pages/example'));

function App() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Example />
		</Suspense>
	)
}
```

Example 컴포넌트가 무거운 컴포넌트라고 가정했을 때, Example 컴포넌트를 불러오는 동안 <div>Loading...</div>가 보여지게 된다.

## Webpack 설정

CRA(Create React App)으로 React 앱을 만든게 아니라, 직접 webpack을 구성했다면 chunkFilename을 추가로 설정해줘야 한다.

**webpack.config.js**
```
output: {
  path: path.resolve('./dist'),
  chunkFilename: '[name].js',
},
```

## Route에 적용

나는 보통 page 별로 lazy import를 해온다. 이렇게 router를 routes.js로 관리하면 하면 나중에 HoC 적용하기도 편리하다. 

**routes.js**
```
import { lazy } from 'react';

const routes = [
  {
    id: 0,
    name: 'notfound',
    path: '*',
    component: lazy(() => import('@/pages/notfound/notfound'))
  },
  {
    id: 1,
    name: 'home',
    path: '/',
    component: lazy(() => import('@/pages/main/home'))
  },
  {
    id: 2,
    name: 'about',
    path: '/about',
    component: lazy(() => import('@/pages/main/about'))
  }
]
```
