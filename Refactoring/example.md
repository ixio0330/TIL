# 1장

리팩토링 1장에서 공연료 청구서 출력하는 함수를 리팩토링 하는 과정을 정리한 내용입니다.

#### 공연할 정보
```
const PLAY = {
  hamlet: { 
    name: 'Hamlet',
    type: 'tragedy',
  },
  'as-like': {
    name: 'As You Like It',
    type: 'comedy',
  },
  othello: {
    name: 'Othello',
    type: 'tragedy',
  }
};
```

#### 공연료 청구서 데이터
```
const INVOICES = {
  customer: 'BigCo',
  performances: [
    {
      playID: 'hamlet',
      audience: 55,
    },
    {
      playID: 'as-like',
      audience: 35,
    },
    {
      playID: 'othello',
      audience: 40,
    }
  ]
};
```

#### 공연료 청구서 출력하는 함수

### Ver.1
```
function statement(invoice, plays) {
  console.log("Ver.1");
  let totalAmount = 0;
  let volumnCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy':
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        break;
      default:
        throw new Error(`Unknowned theme: ${play.type}`);
    }

    // 포인트 적립
    volumnCredits += Math.max(perf.audience - 30, 0);
    
    // 희극 관객 5명마다 추가 포인트 제공
    if (play.type === 'comedy') {
      volumnCredits += Math.floor(perf.audience / 5);
    }

    // 청구서 내역 출력
    result += `${play.name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumnCredits}점\n`;
  return result;
}
```

#### 결과

```
청구 내역 (고객명: BigCo)
Hamlet: $650.00 (55석)
As You Like It: $475.00 (35석)
Othello: $500.00 (40석)
총액: $1,625.00
적립 포인트: 47점
```

#### 작가의 말

- 코드를 여러 함수와 프로그램 요소로 재구성 하기.
- 프로그램의 구조가 빈약하다면 대체로 구조부터 바로잡은 뒤 기능을 수정하는 것이 작업하기 수월하다.

**"프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩터링하고 나서 원하는 기능을 추가한다."**

#### 수정사항

- 청구 내역을 HTML로 출력하는 기능
- 연극 장르와 공연료 정책이 달라질 때마다 statement 함수를 수정해야하는 번거로움

#### 리팩터링의 첫 단계

**"리팩터링하기 전에 제대로 된 테스트부터 마련한다. 테스트는 반드시 자가진단하도록 만든다."**

### Ver.2 statement() 함수 쪼개기

```
function statement(invoice, plays) {
  console.log("Ver.2 함수 쪼개기");
  let totalAmount = 0;
  let volumnCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format;

  function amountFor(perf, play) { // 값이 바뀌지 않는 변수는 매개변수로 전달
    let thisAmount = 0; // 변수 초기화
    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case 'comedy':
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        break;
      default:
        throw new Error(`Unknowned theme: ${play.type}`);
    }
    return thisAmount; // 함수 안에서 값이 바뀌는 변수 반환
  }
  
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);

    // 포인트 적립
    volumnCredits += Math.max(perf.audience - 30, 0);
    
    // 희극 관객 5명마다 추가 포인트 제공
    if (play.type === 'comedy') {
      volumnCredits += Math.floor(perf.audience / 5);
    }

    // 청구서 내역 출력
    result += `${play.name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumnCredits}점\n`;
  return result;
}
```

#### 작가의 말

**"리팩터링은 프로그램 수정을 작은 단계로 나눠 진행한다. 그래서 중간에 실수하더라도 버그를 쉽게 찾을 수 있다."**
작가는 작은 단위로 커밋을 하고, 의미있는 단위로 뭉쳐지면 저장소로 푸시한다고 한다.

#### Ver.3 변수명 변경

```
// 작가의 경우 매개변수의 역할이 뚜렷하지 않을 경우, 부정 관사(a/an)를 붙인다고 함
function amountFor(aPerformance, play) { // 명확한 이름으로 변경
  let result = 0; // 명확한 이름으로 변경
  switch (play.type) {
    case 'tragedy':
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      break;
    default:
      throw new Error(`Unknowned theme: ${play.type}`);
  }
  // 작가의 경우 변수의 역할을 쉽게 파악하기 위해서 함수의 반환 값에는 항상 result를 쓴다고 함
  return result;
}
```

### Ver.4 변수 제거하기

```
function statement(invoice, plays) {
  console.log("Ver.4 변수 제거하기");
  let totalAmount = 0;
  let volumnCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format;
  
  function amountFor(aPerformance) { // play 변수 제거
    let result = 0;
    switch (playFor(aPerformance).type) { // play를 playFor 함수로 변경
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        break;
      default:
        throw new Error(`Unknowned theme: ${playFor(aPerformance).type}`); // play를 playFor 함수로 변경
    }
    return result;
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }
  
  for (let perf of invoice.performances) {
    // const play = playFor(pref); // 1. 우변을 함수로 추출
    // let thisAmount = amountFor(perf, playFor(perf)); // 2. 인라인된 변수 제거
    // let thisAmount = amountFor(perf); // 3. 사용하지 않는 매개변수 제거
    // 사용하지 않는 thisAmount 지역 변수 제거

    // 포인트 적립
    volumnCredits += Math.max(perf.audience - 30, 0);
    
    // 희극 관객 5명마다 추가 포인트 제공
    if (playFor(perf).type === 'comedy') { // 변수 인라인
      volumnCredits += Math.floor(perf.audience / 5);
    }

    // 청구서 내역 출력 // 변수 인라인        // 변수 인라인
    result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf); // 변수 인라인
  }
  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumnCredits}점\n`;
  return result;
}
```

#### 작가의 말

- 지역 변수를 제거해서 얻는 가장 큰 장점은 추출 작업이 훨씬 쉬워진다는 것
- 유효범위를 신경써야 할 대상이 줄어든다.
- 작가는 추출 작업 전에는 거의 항상 지역 변수부터 제거한다고 함

### Ver.5 volumnCreditsFor 함수 분리

```
function statement(invoice, plays) {
  console.log("Ver.5 volumnCreditsFor 함수 분리");
  let totalAmount = 0;
  let volumnCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format;
  
  function amountFor(aPerformance) { 
    let result = 0;
    switch (playFor(aPerformance).type) { 
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        break;
      default:
        throw new Error(`Unknowned theme: ${playFor(aPerformance).type}`);
    }
    return result;
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumnCreditsFor(aPerformance) {
    let volumnCredits = 0;
    volumnCredits += Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === 'comedy') {
      volumnCredits += Math.floor(aPerformance.audience / 5);
    }
    return volumnCredits;
  }
  
  for (let perf of invoice.performances) {
    volumnCredits += volumnCreditsFor(perf);
    result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
  }
  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumnCredits}점\n`;
  return result;
}
```

### Ver.6 임시 변수 제거 (format, volumnCredits, totalAmount 제거)

```
function statement(invoice, plays) {
  console.log("Ver.6 임시 변수 제거 (format, volumnCredits, totalAmount 제거)");
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(aNumber/100);
  }
  
  function amountFor(aPerformance) { 
    let result = 0;
    switch (playFor(aPerformance).type) { 
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        break;
      default:
        throw new Error(`Unknowned theme: ${playFor(aPerformance).type}`);
    }
    return result;
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumnCreditsFor(aPerformance) {
    let volumnCredits = 0;
    volumnCredits += Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === 'comedy') {
      volumnCredits += Math.floor(aPerformance.audience / 5);
    }
    return volumnCredits;
  }

  function totalVolumnCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumnCreditsFor(perf);
    }
    return result;
  }

  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  for (let perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }
  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumnCredits()}점\n`;
  return result;
}
```

#### volumnCredits 변수를 제거하는 과정

1. 반복문 쪼개기로 변수 값을 누적시키는 부분을 분리
2. 문장 슬라이드하기로 변수 초기화 문장을 변수 값 누적 코드 바로 앞으로 이동
3. 함수 추출하기로 적립 포인트 계산 부분을 별도 함수로 추출
4. 변수 인라인하기로 변수 제거

### Ver.7 계산 단계와 포맷팅 단계 분리

```
function statement(invoice, plays) {
  console.log("Ver.7 계산 단계와 포맷팅 단계 분리");
  const statementData = {}; // 중간 데이터 구조를 인수로 전달
  statementData.customer = invoice.customer; // 고객 데이터를 중간 데이터로 옮김
  statementData.performances = invoice.performances.map(enrichPerformances);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumnCredits = totalVolumnCredits(statementData);
  return renderPlainText(statementData);

  function enrichPerformances(aPerformance) {
    const result = { ...aPerformance };
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumnCredits = volumnCreditsFor(result);
    return result;
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) { 
    let result = 0;
    switch (aPerformance.play.type) { 
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        break;
      default:
        throw new Error(`Unknowned theme: ${aPerformance.play.type}`);
    }
    return result;
  }

  function volumnCreditsFor(aPerformance) {
    let volumnCredits = 0;
    volumnCredits += Math.max(aPerformance.audience - 30, 0);
    if (aPerformance.play.type === 'comedy') {
      volumnCredits += Math.floor(aPerformance.audience / 5);
    }
    return volumnCredits;
  }

  function totalVolumnCredits(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumnCredits;
    }
    return result;
  }

  // 반복문 파이프라인으로 분리
  function totalAmount(data) {
    return data.performances.reduce((total, p) => total += p.amount, 0);
  }
}

function renderPlainText(data) { // 사용하지 않는 invoice 매개 변수 제거
  let result = `청구 내역 (고객명: ${data.customer})\n`; // 고객 데이터를 중간 데이터로부터 얻음
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }
  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumnCredits}점\n`;
  return result;
}
```

### Ver.8 다시 한번 분리

```
function statement(invoice, plays) {
  console.log("Ver.8 다시 한번 분리");
  return renderPlainText(createStatementData(invoice, plays));
}

// 중간 데이터 생성을 전달
function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformances);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumnCredits = totalVolumnCredits(statementData);
  return statementData;

  function enrichPerformances(aPerformance) {
    const result = { ...aPerformance };
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumnCredits = volumnCreditsFor(result);
    return result;
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance) { 
    let result = 0;
    switch (aPerformance.play.type) { 
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        break;
      default:
        throw new Error(`Unknowned theme: ${aPerformance.play.type}`);
    }
    return result;
  }

  function volumnCreditsFor(aPerformance) {
    let volumnCredits = 0;
    volumnCredits += Math.max(aPerformance.audience - 30, 0);
    if (aPerformance.play.type === 'comedy') {
      volumnCredits += Math.floor(aPerformance.audience / 5);
    }
    return volumnCredits;
  }

  function totalVolumnCredits(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumnCredits;
    }
    return result;
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total += p.amount, 0);
  }
}
```

### Ver.9 HTML 버전 작성

```
function htmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += `<table>\n`;
  result += `<tr>
    <th>연극</th>
    <th>좌석 수</th>
    <th>금액</th>
  </tr>\n`;
  for (let perf of data.performances) {
    result += `<tr>
      <td>${perf.play.name}</td>
      <td>${perf.audience}석</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += `</table>\n`;
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumnCredits}</em>점</p>`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(aNumber/100);
}
```

### Ver.10 다형성을 활용해 계산 코드 재구성하기

기존의 amountFor 함수는 switch 문을 사용해서 다형성이 딸어진다. 

이후 로직을 계속 건들여야할 가능성이 매우 큰데, 만약 장르가 추가되면 직접 코드를 수정해야 하는 상황이 발생할 수 있다.

```
// 공연료 계산기 클래스
class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new Error('서브클래스에서 처리하도록 설계되었습니다.');
  }

  get volumnCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumnCredits() {
    return super.volumnCredits + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator(aPerformance, aPlay) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`Unknowned theme: ${this.play.type}`);
  }
}

function statement(invoice, plays) {
  console.log("Ver.10 다형성을 활용해 계산 코드 재구성하기");
  return renderPlainText(createStatementData(invoice, plays));
}

function createStatementData(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformances);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumnCredits = totalVolumnCredits(statementData);
  return statementData;

  function enrichPerformances(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = { ...aPerformance };
    result.play = playFor(result);
    result.amount = calculator.amount;
    result.volumnCredits = calculator.volumnCredits;
    return result;
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function totalVolumnCredits(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumnCredits;
    }
    return result;
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total += p.amount, 0);
  }
}
```
