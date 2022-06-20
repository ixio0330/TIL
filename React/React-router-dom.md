# React router dom

React에서 라우팅을 할 수 있게 도와주는 모듈이다.

(v6 기준으로 기록했습니다.)

## 기본 사용 방법

```
// 사용할 모듈 가져오기
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './home';
import Login from './login';

<BrowserRouter>
	<nav>
		// to: 라우팅 할 경로
		<Link to='/'>Home</Link>
		<Link to='/login'>Login</Link>
	</nav>
  <Routes>
		// path: 라우팅 할 경로, element: 컴포넌트
    <Route path='/' element={<Home />}/>
    <Route path='/login' element={<Login />}/>
  </Routes>
</BrowserRouter>
```

간단하게 순서를 표현하면 이렇다.

**BrowserRouter > Routes || Link > Route**

## 중첩 라우팅

중첩 라우팅의 경우 Route 컴포넌트릉 중첩으로 넣으면 된다.

```
<BrowserRouter>
  <Routes>
    <Route path='/' element={<Home />}>
			<Route path='/homeDetail' element={<HomeDetail />} />
		</Route>
  </Routes>
</BrowserRouter>
```

### Outlet

중첩 라우팅을 하고 최상위인 Home 컴포넌트에서 Outlet 컴포넌트를 넣어주면, 경로에 맞게 HomeDetail 컴포넌트가 렌더링 된다.

Home.js

```
import { Outlet } from 'react-router-dom';

const Home = () => {
  return(
    <div className='homePage'>
			<h2>This is home page.</h2>
      // HomeDetail 컴포넌트가 렌더링 될 곳
			<Outlet />
    <div/>
  )
};
```

## NotFound

path에 \*을 넣어서 잘못된 경로로 들어갔을 경우 NotFound 컴포넌트를 보여줄 수 있다.

```
<BrowserRouter>
  <Routes>
    <Route path='/' element={<Home />}/>
    <Route path='*' element={<NotFound />}/>
  </Routes>
</BrowserRouter>
```

## useNavigate

useNavigate를 사용하면 Link 컴포넌트를 사용하지 않아도 원하는 곳으로 라우팅을 시킬 수 있다.

```
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// 첫번째 인자로 라우팅 경로, 두번째 인자로 option 객체를 받는다.
navigate('/path', options = {});
```
