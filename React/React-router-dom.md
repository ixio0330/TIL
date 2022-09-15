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

## History 객체 사용하기

Axios의 interceptors를 사용해서 http response에서 오류가 발생하면, 상태 코드로 원하는 작업을 처리하고 화면 이동을 해야하는 경우가 있다.

그런데 useNavigate 훅은 react 내부에서만 사용할 수 있었기 때문에 아래와 같은 코드는 '잘못된 훅의 호출이라는' 오류를 발생시켰다. 

api.js
```
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const http = axios.create({
  baseURL: 'http://localhost:9000',
});

http.interceptors.request.use(
  (config) => {
    return config;
  }
);

http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    if (!error.response.status) {
      const navigate = useNavigate();
      navigate('/');
      return null;
    }
    return Promise.reject(error.response);
  }
);

export default http;
```

그렇다고 api 통신을 하는 모든 부분에서 response값을 받아서 판단하기에는 무리가 있다고 생각했다. 

분명 axios interceptor 내부에서 처리할 수 있는 방법이 있을텐데, 검색을 해봐도 잘 나오지 않았다.

다행히 stack overflow에 [관련된 질문](https://stackoverflow.com/questions/69953377/react-router-v6-how-to-use-navigate-redirection-in-axios-interceptor)이 있었고 답을 찾을 수 있었다.

추가로 검색해보니 보통 사용되는 <BrowserRouter> 컴포넌트는 <Router> 컴포넌트를 렌더링할때 props로 history 객체를 전달한다고 한다. 

그래서 <Route> 컴포넌트의 props인 element로 넘겨지는 컴포넌트는 history 객체를 받아서 사용할 수 있다.

하지만 나는 view 컴포넌트 내부에서 history 객체가 필요한게 아니라 axios에 interceptor로 등록한 함수 내부에서 사용해야 했다.

그래서 직접 createBrowserHistory 함수를 사용해서 history 객체를 생성하고, unstable_HistoryRouter 컴포넌트에 넣어서 사용하기로 했다.

App.js (필요한 부분만 두고, 나머지 코드들은 제거한 상태)
```
import { Routes, Route, Link, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

function App() {
  return (
    <HistoryRouter history={history}>
      <header>
        <Link to='/'>Home | </Link>
        <Link to='/post'>post</Link>
      </header>
      <Routes>
        <Route path='/' element={<HomeView />} />
        <Route path='/post' element={<PostView />} />
        <Route path='/post/:id' element={<PostDetailView />} />
        <Route path='/post/create' element={<PostCreateView />} />
        <Route path='*' element={<NotFoundView />} />
      </Routes>
    </HistoryRouter>
  );
}
```

이렇게 하면 axios instance를 생성하는 곳에서 history객체를 import해와서 사용할 수 있다.

api.js
```
import axios from 'axios';
import { history } from '../../App';

const http = axios.create({
  baseURL: 'http://localhost:9000',
});

http.interceptors.request.use(
  (config) => {
    return config;
  }
);

http.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    if (!error.response.status) {
      history.replace('/');
      return null;
    }
    return Promise.reject(error.response);
  }
);

export default http;
```

이제 오류없이 페이지 이동이 잘 된다!
