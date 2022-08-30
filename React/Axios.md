# Axios 따라하기

Axios를 쓰면서 interceptor 방식이 정말 편리하다고 생각되었다.

create 함수로 인스턴스를 생성하는 것도 그렇고, 정말 편리해서 한번 간단하게 구현해보고 싶다는 생각에 axios를 따라해보기로 했다.

내가 만든 모듈 이름은 Ixios이고, class로 구현했다.

## Ixios 특징

- instance를 생성해서 사용할 수 있으며, 인스턴스 생성시 baseUrl을 설정할 수 있다.
- get, post, put, delete 총 네가지 메소드를 지원한다.
- interceptors를 제공하며, http 요청 전과 후에 호출할 함수를 등록할 수 있다.

### Request 객체

요청 객체는 fetch api에서 사용되는 것과 같다. 

get, post 등의 메소드 호출시 옵션을 넣을 수 있고, interceptor에서 request.use 함수를 사용해서 요청 전마다 실행시킬 함수를 전달할 수도 있다.

### Response 객체

응답 객체는 request객체를 포함한다. 

Response에는 간단하게 상태 코드, 상태 텍스트, 데이터, 에러 총 네 가지로 구성되어 있다.

#### 소스 코드

index.js
```
export default class Ixios {
  constructor(baseUrl = '') {
    this.#baseUrl = baseUrl;
  }

  #baseUrl = '';
  #request = {
    method: 'GET',
    url: '',
  };

  #response = {
    response: {
      statusText: '',
      status: 0,
      data: null,
      error: null,
    }
  };

  #requestCallback = null;
  #responseCallback = null;
  #errorCallback = null;

  interceptors = {
    request: {
      use: (request) => {
        this.#requestCallback = () => request(this.#request);
      }
    },
    response: {
      use: (response, error) => {
        this.#responseCallback = () => response(this.#response);
        this.#errorCallback = () => error(this.#response);
      }
    }
  };

  // 내부 호출용 method
  async #fetch({ url, method, options }) {
    this.#request = {
      method,
      ...options,
    }

    // HTTP 통신 전 interceptor에 등록한 callback이 있을 경우 실행한다.
    if (typeof this.#requestCallback === 'function') {
      this.#request = this.#requestCallback();
    }

    try {
      // fetch api 사용
      const response = await fetch(this.#baseUrl + url, this.#request);
      const data = await response.json();
      
      this.#response.request = {
        ...this.#request
      };
      this.#response.response.status = response.status;
      this.#response.response.statusText = response.statusText;
      this.#response.response.data = data;

      // HTTP 통신 성공 후 interceptor에 등록한 callback이 있을 경우 실행한다.
      if (typeof this.#responseCallback === 'function') {
        this.#response = this.#responseCallback();
      }
    } catch (error) {
      this.#response.response.error = error;
      
      // HTTP 통신 실패 후 interceptor에 등록한 callback이 있을 경우 실행한다.
      if (typeof this.#errorCallback === 'function') {
        this.#response = this.#errorCallback();
      }
    }
    return this.#response;
  }

  // 외부 호출용 method
  async get({ url, options }) {
    return await this.#fetch({ url, method: 'GET', options });
  }

  async post({ url, options }) {
    return await this.#fetch({ url, method: 'POST', options });
  }

  async put({ url, options }) {
    return await this.#fetch({ url, method: 'PUT', options });
  }

  async delete({ url, options }) {
    return await this.#fetch({ url, method: 'DELETE', options });
  }
}
```

### 사용 예시

먼저 Ixios class를 import 한 후, 인스턴스를 생성한다.

baseUrl은 선택사항이고, 만약 넣었을 경우 baseUrl 이후의 url만 넣어주면 된다.

restaurant.js
```
import Ixios from "./ixios";

const ixios = new Ixios('tour/restaurant.do?page=');
ixios.interceptors.request.use((config) => {
  config.headers = {
    'content-type': 'application/json'
  }
  console.log(config);
  return config;
})


ixios.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    console.log(error);
    return error;
  }
)

export async function getRestaurantData(pageIndex = 1) {
  return await ixios.get({
    url: pageIndex.toString(),
    options: {
      mode: 'no-cors',
    },
  });
}
```
