# 에러 경계(Error Boundary)

React에서 error boundary를 통해 UI에서 발생하는 error를 처리하도록 권장한다. 

React는 null, undefined에 접근하거나 혹은 오류가 발생했을 경우, 화면 자체를 렌더하지 않는다.

그 이유는 사용자에게 잘못된 화면을 보여주는 것보다 아예 화면을 보여주지 않는게 낫다고 판단해서 그렇다고 한다.

Error Boundary는 클래스 컴포넌트를 사용한다. 아직 함수 컴포넌트는 사용할 수 없다고 한다.

errorBoundary.js
```
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    const ErrorScreen = this.props.fallback || DefaultErrorScreen;
    if (this.state.errorInfo) {
      return (
        <ErrorScreen
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }
    return this.props.children;
  }
}

function DefaultErrorScreen({ error, errorInfo }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Something went wrong.</h2>
      <details style={{ whiteSpace: 'pre-wrap' }}>
        {error && error.toString()}
        <br />
        {errorInfo.componentStack}
      </details>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
```

App.js
```
<ErrorBoundary>
  <Example />
</ErrorBoundary>
```

만약 Example 컴포넌트에서 오류가 발생하면 DefaultErrorScreen이 화면에 출력된다.

## 참고자료

[에러 경계](https://ko.reactjs.org/docs/error-boundaries.html)
