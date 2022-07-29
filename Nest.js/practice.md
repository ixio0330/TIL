# 실습 따라하기

실습을 따라하며 작성한 내용입니다.

## UsersSerivce의 인터페이스

유저 서비스의 인터페이스를 정의하고 컨트롤러를 구현 할 차례다. 유저 서비스는 외부에서 4가지의 요청을 받아 처리한다.

1. 회원가입
- 엔드포인트: POST/users
- 본문 데이터: 
```
{
  "name": "name",
  "email": "email@example.com",
  "password": "password"
}
```
- 쿼리 파라미터: X
- 패스 파라미터: X
- 응답: 201

2. 이메일 인증
- 엔드포인트: POST/users/email-verify
- 본문 데이터: 
```
{
  “signupVerifyToken”: ““signupVerifyToken””
}
```
- 쿼리 파라미터: X
- 패스 파라미터: X
- 응답: 201, 액세스 토큰

3. 로그인
- 엔드포인트: POST/usres/login
- 본문 데이터: 
```
{
  "email": "email@example.com",
  "password": "password"
}
```
- 쿼리 파라미터: X
- 패스 파라미터: X
- 응답: 201, 액세스 토큰

4. 회원 정보 조회
- 엔드포인트: GET/users/:id
- 본문 데이터: X
- 쿼리 파라미터: X
- 패스 파라미터: id(사용자 생성시 서버에서 부여한 사용자 ID)
- 응답: 200, 회원 정보

이에 맞게 컨트롤러를 구성하기 위해 Users 컨트롤러를 생성한다.

```
nest g co Users
```

### UsersController 구현하기

원래 dto도 파일을 분리해서 사용하는데, 이해를 위해 controller 파일에 한번에 작성했습니다.

먼저 회원가입 인터페이스를 구현해보자.

users.controller.ts
```
import { Body, Controller, Post } from '@nestjs/common';

class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

@Controller('users')
export class UsersController {
  @Post() 
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    console.log(dto);
  }
}
```

vscode에서 확장앱인 REST Client를 설치하고 .http 파일을 생성한다. 아래에 양식에 맞춰 http 요청 후 콘솔창을 보면, { name: 'test', email: 'email@example.com', password: '1234' } 이 출력되어 있는 것을 확인할 수 있다. 

**테스트**
```
POST http://localhost:3000/users HTTP/1.1
content-type: application/json

{
  "name": "test",
  "email": "email@example.com",
  "password": "1234"
}
```

이제 나머지 인터페이스도 구현한다.

```
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

class VerfiyEmailDto {
  readonly signupVerifyToken: string;
}

class UserLoginDto {
  email: string;
  password: string;
}

class UserInfo extends CreateUserDto {}

@Controller('users')
export class UsersController {
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    console.log(dto);
    return;
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerfiyEmailDto): Promise<void> {
    console.log(dto);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<void> {
    console.log(dto);
    return;
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    console.log(userId);
    return;
  }
}
```

**테스트**
- 이메일 인증
```
// 요청
POST http://localhost:3000/users/email-verify?signupVerifyToken=test_token HTTP/1.1

// 콘솔창
{ signupVerifyToken: 'test_token' }
```
- 로그인
```
// 요청
POST http://localhost:3000/users/login HTTP/1.1
content-type: application/json

{
  "email": "email@example.com",
  "password": "1234"
}

// 콘솔창
{ email: 'email@example.com', password: '1234' }
```
- 회원 정보 조회
```
// 요청
GET http://localhost:3000/users/user_id HTTP/1.1

// 콘솔창
user_id
```

### UsersService 구현하기 (프로바이더)

이제 핵심 기능을 수행할 프로바이더를 생성한다. 아래 명령어로 service를 생성할 수 있다.

```
nest g s Users
```

#### 회원 가입 요청 구현

먼저 이메일 검증에 사용할 토큰 형식을 uuid로 사용하기 위해 uuid 라이브러리를 설치한다.

```
$ npm i uuid
$ npm i --save-dev @types/uuid
```

회원 가입을 요청받는 컨트롤러에서 UsersService를 주입받고, createUser를 수행하는 역할을 UsersService에게 위임한다.

users.controller.ts
```
constructor(private readonly usersService: UsersService) {}

@Post()
async createUser(@Body() dto: CreateUserDto): Promise<void> {
  const { name, email, password } = dto;
  return this.usersService.createUser(name, email, password);
}
```

이제 UsersService에서는 사용자 등록을 위해 사용자 중복 체크, 사용자 저장, 이메일 발송 등의 기능을 수행해야 한다.

users.service.ts
```
@Injectable()
export class UsersService {
  createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);
    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  // 사용자 중복 체크 (DB 연동 후)
  private checkUserExists(email: string) {
    return false;
  }
  
  //사용자 저장 (DB 연동 후)
  private saveUser(
    name: string,
    email: string,
    password: string,
    singupVerifyToken: string,
  ) {
    return;
  }

  // 이메일 발송 (EmailService 생성 후)
  private async sendMemberJoinEmail(email: string, singupVerifyToken: string) {
    return;
  }
}
```

아직 이메일 발송을 담당하는 프로바이더가 없어서 이메일 발송을 할 수 없다. EmailService를 만들어보자. 

```
$ nest g s Email
```

EmailService는 이메일을 발송하는 역할을 수행한다. 이 때, nodemailer라는 무료로 이메일을 전송해주는 라이브러리를 사용하게 된다. 테스트 용으로만 사용하고 상용 서비스에는 적용하면 안된다.

우선 nodemailer를 설치한다.

```
$ npm i nodemailer
$ npm i @types/nodemailer --save-dev
```

email.service.ts
```
import { Injectable } from '@nestjs/common';
import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'YOUR_GMAIL', // TODO: config
        pass: 'YOUR_PASSWORD', // TODO: config
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000'; // TODO: config

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼를 누르시면 가입 인증이 완료됩니다.<br/>
        <form action="${url}" method="POST">
          <button>가입확인</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
```

(예제에서는 action 메소드를 이용했지만, Gmail에서 해당 방식을 지원하지 않는다고 한다. 그래서 나는 인증번호를 발송해서 확인받는 방식으로 할 예정이다.)

이제 UsersSerivce에서 emailService를 의존성 주입을 해서 사용한다.

users.service.ts
```
constructor(private readonly emailService: EmailService) {}

private async sendMemberJoinEmail(email: string, singupVerifyToken: string) {
  return this.emailService.sendMemberJoinVerification(
    email,
    singupVerifyToken,
  );
}
```

그리고 user.module.ts에서 emailService를 providers로 등록해줘야 오류가 나지 않는다.


#### 이메일 인증

회원 가입 요청을 하고 받은 메일을 확인하고 가입확인 버튼을 눌러 다시 요청이 전달되는지 확인해보자. 

/email-verify 엔드포인트로 요청이 왔다면 콘솔에 { signupVerifyToken: 'uuid' } dto가 출력되어 있을 것이다.

이제 이메일 인증 로직 역시 UsersService에 처리 로직을 위임하도록 코드를 수정한다.

users.controller.ts
```
@Post('/email-verify')
async verifyEmail(@Query() dto: VerfiyEmailDto): Promise<string> {
  const { signupVerifyToken } = dto;
  return await this.usersService.verifyEmail(signupVerifyToken);
}
```

UsersService에는 이메일 인증로직을 구현해야 한다. 데이터베이스가 필요하기 때문에 나중에 구현해할 사항을 주석으로 적어두고, 일단은 에러를 일으키도록 해둔다.

users.service.ts
```
async verifyEmail(signupVerifyToken: string): Promise<string> {
  // TODO
  // 1. DB에서 signupVerifyToken으로 회원 가입 처리중인 유저가 있는지 조회하고 없다면 에러 처리
  // 2. 바로 로그인 상태가 되도록 JWT를 발급

  throw new Error('Method not implemented.');
}
```

#### 로그인

로그인 역시 컨트롤러에서는 요청, 응답만 처리하고 나머지는 UsersService에 위임한다.

users.controller.ts
```
@Post('/login')
async login(@Body() dto: UserLoginDto): Promise<string> {
  const { email, password } = dto;
  return await this.usersService.login(email, password);
}
```

users.service.ts
```
async login(email: string, password: string): Promise<string> {
  // TODO
  // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
  // 2. JWT를 발급

  throw new Error('Method not implemented.');
}
```

#### 사용자 정보 조회

사용자 정보 조회 역시 컨트롤러에서는 요청, 응답만 처리하고 나머지는 UsersService에 위임한다.

users.controller.ts
```
@Get('/:id')
async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
  return await this.usersService.getUserInfo(userId);
}
```

users.service.ts
```
async getUserInfo(userId: string): Promise<UserInfo> {
  // TODO
  // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
  // 2. 조회된 데이터를 UserInfo 타입으로 응답

  throw new Error('Method not implemented.');
}
```

## 모듈 분리

이제는 직접 프로바이더를 주입 받지 말고, Users, Email 등을 모듈로 분리해서 사용하자. 

먼저 아래 명령어로 Email 모듈을 생성한다.

```
$ nest g s Email
```

UsersModule에서는 email 프로바이더를 직접 주입했었는데, email을 모듈로 만들고 내보내서 EmailModule을 사용하도록 한다.

email.module.ts
```
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
```

users.module.ts
```
@Module({
  imports: [EmailModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

## 환경변수 구성하기

환경변수 설정과 환경변수의 유효성 검사를 위한 joi 라이브러리를 설치한다.

```
$ npm i @nestjs/config
$ npm i joi
```

이제는 환경변수를 루트 경로가 아니라 폴더에 모아두고, 환경변수를 emailConfig, databaseConfig와 같이 묶어서 사용할 예정이다.

그리고 src 폴더 안에 config 폴더를 생성하고, envs 폴더와 emailConfig.ts 파일을 생성한다.

emailConfig.ts
```
import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
}));
```

registerAs는 'email'이라는 토큰으로 ConfigFactory를 등록할 수 있는 함수라고 한다. 이 함수를 이용해서 곧이어 설명할 ConfigModule을 동적으로 등록할 수 있다.

Nest 기본 빌드 옵션은 .ts 파일 외의 asset은 제외하도록 되어 있다고 한다. 환경변수 파일을 out 디렉토리(dist 디렉토리)에 복사할 수 있도록 nest-cli.json에서 옵션을 바꿔준다.

nest-cli.json
```
"compilerOptions": {
  "assets": [
    {
      "include": "./config/envs/*.env",
      "outDir": "./dist"
    }
  ]
}
```

이제 AppModule에 ConfigModule을 동적 모듈로 등록해보자!

app.module.ts
```
ConfigModule.forRoot({
  envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
  isGlobal: true,
  load: [emailConfig],
}),
```

# 오류 발생!

분명 nest의 컴파일 옵션을 설정하고 서버를 실행시켰는데, dist 폴더에 .env 파일이 아무것도 들어오지 않아서 환경변수를 읽어올 수 없었다..

compilerOptions 내부에 assets을 포함시키지 않았어서, 포함을 시켰는데도 process.env.~ 등의 환경변수를 읽어오지 못했다.

혹시나 파일 경로를 못 읽어오는게 아닐까 싶어서 파일을 읽어와봤는데 환경변수 파일이 잘 출력되어서 어리둥절한 상태다.

```
fs.readFile(
  `${__dirname}/config/envs/${process.env.NODE_ENV}.env`,
  'utf-8',
  (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  },
);
```

다시 확인해보니 서버 실행시킬 때는 환경변수가 주입 안된 상태이고, http 요청을 해보니 환경변수 출력이 잘 된다. 그동안 envs를 env로 한다던지 등의 오타가 좀 있어서 안되었던 듯 하다. 다시 이어서~!

### 유효성 검사

아까 설치한 joi로 환경변수의 값에 대해 유효성 검사를 수행하도록 유효성 검사 객체를 작성해야 한다. config 파일에 validationSchema.ts 파일을 생성한다.

validationSchema.ts
```
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri(),
});
```

AppModule에 등록해주자!

app.module.ts
```
ConfigModule.forRoot({
  envFilePath,
  load: [emailConfig],
  isGlobal: true,
  validationSchema,
}),
```

그리고 이제 mailService에서 사용해보자.

email.service.ts
```
constructor(
  @Inject(emailConfig.KEY)
  private readonly config: ConfigType<typeof emailConfig>,
) {
  this.transporter = nodemailer.createTransport({
    service: this.config.service,
    auth: this.config.auth,
  });
}
```

emailConfig를 emailService에서 주입받아 사용하면 된다.

다시 API를 호출해서 이메일이 잘 전송되는지 확인해보자.

## 유효성 검사 적용

유효성 검사 라이브러리를 설치한다.

```
$ npm i --save class-validator class-transformer
```

그리고 Nest에서 제공하는 ValidationPipe를 전역으로 적용하기 위해, main.ts를 수정한다. class-transformer 사용을 위해 { transform: true } 으로 설정한다.

main.ts
```
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);
```

이제 class-validator를 사용해서 유효성 검증을 하자.

```
class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
```

IsNotEmpty, IsString과 같은 것보다 Matches, IsEmail이 더 많은 검증을 거쳐야 하기 때문에 가장 아래에 뒀다. (유효하지 않은 값일 경우 빨리 예외를 던져서 서버의 자원을 덜 소모할 수 있음: 내 생각)

이번에는 class-transformer에서 제공하는 기능 중에 많이 사용되는 @Transform 데코레이터를 사용해보자.

만약 이름에 공백이 있으면 안되는데, 공백이 있을 경우 예외를 던지도록 만들어보자.

```
@Transform((param) => {
  if (param.value?.includes(' ')) {
    throw new BadRequestException('space is not allowed');
  }
  return param.value;
})
@IsNotEmpty()
@IsString()
@MinLength(1)
@MaxLength(20)
readonly name: string;
```

name에 공백을 추가해서 API를 호출하면 Bad Request 응답을 준다.

TransformFnParams에는 obj 속성이 있다. obj는 현재 속성이 속해있는 객체를 가리킨다. 즉, name속성을 가지고 있는 CreateUserDto 객체를 의미한다. obj의 다른 속성 값에 따라 구현을 달리 할 수도 있다. 예를 들어 password는 name과 같은 문자열을 포함할 수 없도록 제한할 수도 있다.

```
@Transform((param) => {
  if (param.obj?.password.includes(param.value)) {
    throw new BadRequestException('password cannot contain a name.');
  }
  return param.value;
})
```

password에 name을 포함시켜서 요청을 보내보면 Bad Request 응답을 준다.

## 커스텀 유효성 검사기 작성

@Transform 내에서 예외를 던지지 않고 유효성 검사를 수행하는 데코레이터를 만들어 사용할 수 있다. 커스텀 유효성 검사기를 작성하는 것은 Nest의 기술이 아니라 class-validator의 영역이다. 익혀두면 유용하게 써먹을 수 있다고 한다!

notin.pipe.ts
```
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// 데코레이터의 인자는 객체에서 참조하려고 하는 다른 속성의 이름과 ValidationOptions를 받음
export function NotIn(property: string, validationOptions?: ValidationOptions) {
  // registerDecorator를 호출하는 함수를 리턴. 이 함수의 인자로 데코레이터가 선언될 객체와 속성이름을 받음
  return (object: object, propertyName: string) => {
    // registerDecorator함수는 ValidationDecoratorOptions 객체를 인자로 받음
    registerDecorator({
      name: 'NotIn', // 데코레이터 이름 설정
      target: object.constructor, // 이 데코레이터는 객체가 생성될 때 적용
      propertyName, 
      options: validationOptions, // 유효성 옵션은 데코레이터의 인자로 전달받은 것을 사용
      constraints: [property],
      validator: { // 가장 중요한 유효성 검사 규칙이 validator 속성에 기술
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
```

## TypeORM을 사용한 DB 연결

예제에서는 MySQL을 사용했지만, 나는 postgres를 사용할 예정이다. 나는 nset 버전이 8이여서 예제와 같이 typeorm의 버전을 명시해서 설치했다. (최근에 nest가 9버전이 릴리즈 되었는데, 예전 버전을 쓰는게 좋다는 글을 본적이 있어서 8버전을 쓰고 있다.)

```
$ npm i -S typeorm@0.2.41 @nestjs/typeorm@8.0.2 ps
```

**-S의 의미**

-S 는 --save라는 뜻이다. 언젠가 -S 옵션을 함께 쓰는게 좋다는 얘기를 듣고, 그 후로는 항상 -S 옵션을 써서 라이브러리를 다운받았었다.

문득, -S의 제대로 된 의미가 궁금해져서 찾아보니 --save 옵션은 package.json의 dependency 항목에 모듈을 추가한다는 의미라고 한다.

-S를 안해도 잘만 dependency 항목에 들어가길래 무슨 차이인가 싶었는데, 예전에는 package.json dependency 항목에 추가되지 않는게 기본 옵션이었다고 한다. 다른 환경에서 작업할 경우 -S 옵션을 사용해 다운받지 않은 라이브러리는 npm i 를 했을 경우 node_modules에 추가되지 않았었다고,,

하지만 npm5 부터는 --save가 기본 옵션이라서 이제는 --save를 사용하지 않아도 dependencies에 자동으로 항목이 추가되는 거라고 한다.

출처: [xtring.dev:티스토리](https://xtring-dev.tistory.com/11)

이제 앞으로는 -S 옵션 없이 다운받아야겠다!

# 오류 발생!

postgres는 이미 설치되어 있어서, user랑 database만 설치하고 디비버로 연결하려고 했더니 아래 오류가 났다.

```
The authentication type 10 is not supported. Check that you have configured the pg_hba.conf file to include the client's IP address or subnet, and that it is using an authentication scheme supported by the driver.
```

디비버 업데이트 하고 나서 생긴 오류라서 찾아보니, postgres랑 java 버전이 달라서 버전을 맞춰줘야 한다고 한다. 예전에도 한번 jdbc driver버전 맞추느라 시간을 오래 썼던적이 있었다.. 다시 해야지^^!

예전에는 jdbc드라이버 파일을 직접 다운받아서 넣어줬는데, 이번에는 디비버에서 기존 드라이버 삭제하고 버전 업데이트 했더니 잘 된다.

#### 해결 방법

상단에 데이터베이서 -> 드라이버 관리자 -> postgresql 선택 후 오른쪽에 Edit -> Libraries으로 이동 -> Download/Update 클릭 -> Version 부분 눌러서 최신 버전으로 설정

이렇게 하니까 바로 연결이 잘 되었다. 다시 TypeORM 연동하러~!

TypeORM을 설치했으면, AppModule에서 TypeORM module을 imports 해줘야 한다.

app.module.ts
```
TypeOrmModule.forRoot({
  type: 'postgres', // DB 타입
  host: process.env.DATABASE_HOST, // 호스트 주소
  port: parseInt(process.env.DATABASE_PORT), // DB 포트
  username: process.env.DATABASE_USERNAME, // DB 주인 이름
  password: process.env.DATABASE_PASSWORD, // DB 주인 비밀번호
  database: process.env.DATABASE_NAME, // DB 이름
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 클래스의 경로
  synchronize:  Boolean(process.env.DATABASE_SYNCHRONIZE), // 서비스 구동시 소스코드 기반으로 데이터베이스 스키마를 동기화 할지 여부 (로컬환경에서는 개발 편의를 위해 true로 설정)
}),
```

환경변수로 설정하고 환경변수를 읽어서 넣어줬고 port는 number type, synchronize는 boolean type으로 형변환 해줬다. 

참고로 나의 경우에는 .env 파일을 변경하고 dist 폴더에 가보면 변경된 파일이 복사되어 있지 않아서, dist 폴더를 한번 지우고 서버를 재가동 시켜줬다.

**synchronize 옵션을 true로 하면 서비스가 실행되고 데이터베이스가 연결될 때 항상 데이터베이스가 초기화 되므로 절대 프로덕션에는 true로 하면 안된다고 한다!!**

추가로, connection 정보를 입력하는 방법은 다양하다.

참고: [NestJS | 데이터베이스 연결, 설정 정보를 입력하는 다양한 방법... (database connection)](https://gaemi606.tistory.com/entry/NestJS-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%97%B0%EA%B2%B0-%EC%84%A4%EC%A0%95-%EC%A0%95%EB%B3%B4%EB%A5%BC-%EC%9E%85%EB%A0%A5%ED%95%98%EB%8A%94-%EB%8B%A4%EC%96%91%ED%95%9C-%EB%B0%A9%EB%B2%95-database-connection)

### 사용자 정보 저장하기

먼저 사용자 엔티티를 정의해야 하는데, 그동안 엔티티에 대한 정확한 개념을 이해하기 보다는 그냥 받아들였는데(?) 엔티티의 의미가 뭔지 궁금해서 찾아봤다.

>1. 엔티티란
>- 데이터의 집합을 의미
>- 저장되고, 관리되어야하는 데이터
>- 개념, 장소, 사건 등을 가리킴
>- 유형 또는 무형의 대상을 가리킴

>2. 엔티티의 종류
>- 유형과 무형에 따른 종류
>  - 유형 엔티티 : 학생, 선생님, 손님 등 지속적으로 사용됨
>  - 개념 엔티티 : 보험상품, 조직 등 물리적 형태 없이 개념적으로 사용됨
>  - 사건 엔티티 : 주문, 취소, 수수료 등 비즈니스 프로세스를 실행하면서 생성됨
>- 발생시점에 따른 엔티티 종류
>  - 기본 엔티티 : 고객, 상품 등 키 엔티티라고도 함
>  - 중심 엔티티 : 주문, 취소 등 기본 엔티티로부터 발생되고 행위 엔티티를 생성
>  - 행위 엔티티 : 주문 내용, 취소 내용 등 2개 이상의 엔티티로부터 발생

출처: [[DataBase]엔티티[Entity]란 무엇일까?](https://rh-cp.tistory.com/78)

이제 제대로 사용자 엔티티를 정의하자. 사용자는 유형 엔티티, 기본 엔티티에 속하게 된다. 기존에 controller 파일에 있던 dto도 분리하자.

users 폴더에 dto 폴더를 생성하고 create-users.dto.ts와 users.entity.ts 파일을 생성한다. create-users.dto.ts에는 기존에 있던 CreateUsetDto를 넣어주면 된다.

users.entity.ts
```
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column()
  signupVerifyNumber: number;
}
```

예제에서는 signupVerifyToken를 사용하지만, Gmail에서 막아놨기 때문에 랜덤으로 숫자를 생성해서 보내줄 예정이라고 위에서 언급했었다.

# 오류 발생!

나는 똑같이 쳤는데, UserEntity에 primary 컬럼이 없다고 계속 오류가 났다..^^

#### 해결 방법

왜일까 생각해봤는데, app.module.ts에서 TypeOrmModule의 forRoot함수에서 entities: [__dirname + '/**/*.entity{.ts,.js}'] 로 설정했던게 생각났다.

나는 src/users/dto/user.entity.ts 경로로 entity 파일을 생성했기 때문에 entity 파일 경로를 못읽어오는 것 같아서 앞에 **를 하나 더 붙였다.

```
entities: [__dirname + '/**/**/*.entity{.ts,.js}']
```

dist폴더 지우고 서버 재가동하니까 잘 된다!

뜬금없지만,, 초보자의 입장에서는 정해진 틀에 따라서 하지 않아서 만나는 오류들이 많은 것 같다. 오류를 이해하려면 해당 프레임워크나 라이브러리의 구조에 대한 이해가 필요한데, 초보자는 따라가기도 벅차다,, 엉엉

다시 힘내서 다음으로~!

이제 오류 없이 서버가 잘 돌아가서 디비버를 통해서 User 테이블이 생성됐는지 확인했다. 테이블이랑 컬럼이 잘 설정되어 있었다. ^0^ (synchrozie옵션이 true로 되어있는 덕분이라고 함)

이제 UsersService에서 TODO로 남겨놨던 함수들을 구현할 차례다.

먼저 UsersModule에서 forFeature 메소드로 사용자 모듈 내에서 사용할 저장소를 등록해야 한다.

users.module.ts
```
imports: [TypeOrmModule.forFeature([UserEntity])]
```

그리고 UsersService에서 사용자 리포지토리를 주입한다.

users.service.ts
```
constructor(
  @InjectRepository(UserEntity)
  private usersRepository: Repository<UserEntity>
) {}
```

이제 사용자 저장 함수를 완성해보자!

```
private async saveUser(
  name: string,
  email: string,
  password: string,
  signupVerifyNumber: number,
) {
  const user = new UserEntity();
  user.id = uuid.v1();
  user.name = name;
  user.email = email;
  user.password = password;
  user.signupVerifyNumber = signupVerifyNumber;
  await this.usersRepository.save(user); // 데이터베이스에 저장
}
```

기존에 express 사용할 때 직접 sql 쿼리문을 작성해서 테이블 생성하고, 컬럼 설정하고, 사용자 저장하고 그랬던 기억이 새록새록... TypeORM 정말 너무 편하다.

사용자 정보를 확인하는 함수도 완성해보자. 예제에서는 user !== undefined을 반환해서 boolean으로 체크하도록 했는데, 나는 그냥 예외를 던지려고 한다.

```
private async checkUserExists(email: string) {
  const user = await this.usersRepository.findOne({ email });
  if (!user) {
    throw new UnprocessableEntityException('이미 존재하는 이메일 입니다.');
  }
}
```

나는 개인적으로,, 결과를 boolean으로 확인해서 예외를 던지는게 번거롭다고 느껴져서 문제가 있으면 바로 예외를 던지는게 낫다고 생각한다.

### 트랜잭션 적용

트랜잭션은 요청을 처리하는 과정에서 데이터베이스에 변경이 일어나는 요청을 독립적으로 분리하고 에러가 발생했을 경우 이전 상태로 되돌리게 하기 위해 데이터베이스에서 제공하는 기능이다.

TypeORM에서 트랜잭션을 사용하는 방법

- QueryRunner를 이용해서 단일 DB 커넥션 상태를 생성하고 관리
- transaction 객체를 생성해서 이용
- @Transaction, @TransactionManager, @TransactionRepository 데코레이터 사용

#### QueryRunner 클래스를 사용

# 오류 발생!

사용할 서비스에 Connection 객체를 주입하고 사용할 수 있다고 하는데 나는 오류가 났다.

```
Nest can't resolve dependencies of the UsersService (UserEntityRepository, ?, EmailService)

Potential solutions:
- If Repository is a provider, is it part of the current UsersModule?
- If Repository is exported from a separate @Module, is that module imported within UsersModule?
  @Module({
    imports: [ /* the Module containing Repository */ ]
  })
```

분명 TypeOrmModule을 주입해줬는데, 왜 의존성 문제가 발생하는걸까?

기존에 생성자에서 사용할 서비스를 주입할 때, 순서에 상관없이 주입했었는데 모듈 의존성을 설정하는데 순서도 중요한가보다.

```
constructor(
  @InjectRepository(UserEntity)
  private connection: Connection,
  private usersRepository: Repository<UserEntity>,
  private readonly emailService: EmailService,
) {}
```

기존에는 위에처럼 connection이 위에 있었고 계속 오류가 발생했다.

```
constructor(
  @InjectRepository(UserEntity)
  private usersRepository: Repository<UserEntity>,
  private connection: Connection,
  private readonly emailService: EmailService,
) {}
```

이렇게 순서를 바꾸니까 잘 된다. 띠용,,

일단 이어서 진행하자! QueryRunner를 사용하는 예시이다.

users.service.ts
```
private async saveUserUsingQueryRunner(
  name: string,
  email: string,
  password: string,
  signupVerifyNumber: number,
) {
  const queryRunner = this.connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = new UserEntity();
    user.id = uuid.v1();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyNumber = signupVerifyNumber;

    await queryRunner.manager.save(user);

    // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

    await queryRunner.commitTransaction();
  } catch (e) {
    // 에러가 발생하면 롤백
    await queryRunner.rollbackTransaction();
  } finally {
    // 직접 생성한 QueryRunner는 해제시켜 주어야 함
    await queryRunner.release();
  }
}
```

#### transaction 객체를 생성해서 이용

transaction 메소스는 주어진 함수 실행을 트랜잭션으로 래핑한다.

users.service.ts
```
private async saveUserUsingTransaction(
  name: string,
  email: string,
  password: string,
  signupVerifyNumber: number,
) {
  await this.connection.transaction(async (manager) => {
    const user = new UserEntity();
    user.id = uuid.v1();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyNumber = signupVerifyNumber;

    await manager.save(user);

    // throw new InternalServerErrorException();
  });
}
```

이렇게 하고 사용자 생성하는 함수에서 saveUser 함수가 아니라 위에 새로 만든 함수로 호출해서 테스트를 해보면 되는데, 사실 아직까진 크게 필요하지 않은 것 같아서 일단 두기로 했다.

```
async createUser(name: string, email: string, password: string) {
  await this.checkUserExists(email);
  const signupVerifyNumber = Math.floor(Math.random() * 10000) + 1;
  await this.[saveUserUsingQueryRunner/saveUserUsingTransaction](
    name,
    email,
    password,
    signupVerifyNumber,
  );
  await this.sendMemberJoinEmail(email, signupVerifyNumber);
}
```

<!-- ### 마이그레이션

넓은 의미의 마이그레이션은 애플리케이션이 구동되는 OS를 바꾸거나 데이터베이스를 MySQL에서 Oracle로 바꾸는 것과 같이 인프라를 교체하는 것이 포함된다고 한다. (나는 마이그레이션은 DB 관련해서만 들어봤었다.) 

서비스를 개발하다 보면 데이터베이스 스키마를 변경할 일이 빈번하게 발생한다. 신기능을 추가하면서 새로운 테이블을 생성하기도 하고 테이블 필드의 이름이나 속성을 변경해야 하는 일도 있다. 만약 이전에 저장해 둔 데이터가 현재의 도메인 구조와 다르다면 모든 데이터의 값을 수정할 일도 생기는데 이런 과정 역시 마이그레이션이라고 부른다고 한다.

마이그레이션의 장점
- 마이그레이션을 위한 SQL문을 직접 작성하지 않아도 됨
- 마이그레이션 코드를 일정한 형식으로 소스 저장소에서 관리할 수 있음
- 마이그레이션 이력을 관리할 수 있음

우선 필요한 패키지를 다운받는다.

```
$ npm i -g ts-node
```

이제 package.json에 scripts를 추가한다.

```
"scripts": {
  "typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js"
}
```

이렇게 하면 마이그레이션을 CLI로 생성하고 실행할 수 있는 환경이 구성된 것이다. 이제 AppModule에서 마이그레이션 관련 옵션을 추가한다.

app.module.ts
```
TypeOrmModule.forRoot({
  synchronize: false,
  migrations: [__dirname + 'migrations/*{.ts,.js}'], // 마이그레이션을 수행할 파일
  cli: {
    migrationsDir: process.cwd() + '/src/migrations', // 마이그레이션 파일을 생성할 디렉토리
  },
  migrationsTableName: 'migrations', // 마이그레이션 이력이 기록되는 테이블 이름 (기본값은 migrations으로 생략 가능)
})
```

마이그레이션 테스트를 원할하게 하기 위해 synchronize를 false로 변경했다. (이건 굳이 환경변수로 관리하지 않아도 될 것 같다.)

파일을 생성하는 방법
- migration:create : 수행할 마이그레이션 내용이 비어있는 파일을 생성
- migration:generate : 현재 소스코드와 migrations 테이블에 기록된 이력을 기반으로 마이그레이션 파일을 자동 생성

먼저 migration:create 명령어를 사용해보자. -n 옵션은 생성될 파일의 이름과 마이그레이션 이력에 사용된다고 한다.

```
$ npm run typeorm migration:create -- -n CreateUserTable
```

파일이 생성되었다. 

```
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1659063456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
```

파일이 루트 경로로 생성되어서 생성 경로를 다시 수정해도 계속 루트경로에 생성되서,, 일단 넘어가기로 했다. 그리고 마이그레이션도 당장 중요한 작업은 아니여서 일단 스킵! -->

## 미들웨어(Middleware)

Nest의 미들웨어는 Express의 미들웨어와 같다. 

Express 공식 문서에 따르면 미들웨어가 수행하는 동작은 다음과 같다고 한다.

- 어떤 형태의 코드라도 수행할 수 있음
- 요청과 응답에 변형을 가할 수 있음
- 요청-응답 주기를 끝낼 수 있음
- 여러 개의 미들웨어를 사용한다면 next()로 호출 스택상 다음 미들웨어에게 제어권을 전달

요청-응답 주기를 끝낸다는 것은 응답을 보내거나 에러처리를 해야 한다는 뜻이다. 

만약 미들웨어가 응답 주기를 끝내지 않는다면 반드시 next()를 호출해야 하는데, 그렇지 않으면 어플리케이션은 더이상 아무것도 할 수 없는 상태(각주 hanging)가 된다고 한다. 

미들웨어를 활영해서 다음과 같은 작업들을 수행할 수 있다.

- 쿠키 파싱: 쿠키를 파싱하여 사용하기 쉬운 데이터 구조로 변경
- 세션 관리: 세션 쿠키를 찾고, 해당 쿠키에 대한 세션의 상태를 조회해서 요청에 세션 정보를 추가
- 인증/인가: 사용자가 서비스에 접근 가능한 권한이 있는지 확인. (Nest는 인가를 구현할 때 가드(Guard)를 이용하도록 권장함)
- 본문(body) 파싱: 본문은 POST/PUT 요청으로 들어오는 json 타입뿐 아니라 파일 스트림과 같은 데이터도 있음. 이 데이터를 유형에 따라 읽고 해석한 다음 파라미터에 넣는 작업. 

### Logger 미들웨어

요청에 포함된 정보를 로깅하기 위한 Logger를 미들웨어로 구현해보자. src 폴더에 middleware 폴더를 생성하고 logger.middleware.ts 파일을 생성한다.

logger.middleware.ts
```
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleWare implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log('Request...');
    next();
  }
}
```

미들웨어를 모듈에 포함시키기 위해서는 해당 모듈은 NestModule 인터페이스를 구현해야 하는데, AppModule에 구현해보자.

app.module.ts
```
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleWare).forRoutes('/users');
  }
}
```

/users경로로 api 호출을 해보면 콘솔에 Request...가 출력되는걸 확인해볼 수 있다.

### MiddlewareConsumer

만약 두 개 이상의 미들웨어를 사용하고 싶다면, apply함수에 원하는 미들웨어를 넣어서 사용하면 된다.

똑같이 요청이 들어오면 콘솔에 Request를 출력하는 미들웨어를 만들어서 사용해보자.

```
configure(consumer: MiddlewareConsumer): any {
  consumer.apply(LoggerMiddleWare, Logger2MiddleWare).forRoutes('/users');
}
```

api 호출을 해보면 잘 작동이 된다.

/users가 아니라 UsersController의 모든 라우팅 경로에 대해 미들웨어를 사용하고 싶다면 forRoutes에 컨트롤러를 넣어주면 된다.

첫번째 미들웨어에서 응답 처리를 하면 두번째 미들웨어는 동작하지 않는다.

logger.middleware.ts
```
use(req: any, res: any, next: (error?: any) => void) {
  console.log('Request...');
  res.send('DONE!');
}
```

exclude 함수를 사용해서 미들웨어를 적용하지 않을 라우팅 경로를 설정할 수도 있다.

app.module.ts
```
configure(consumer: MiddlewareConsumer): any {
  consumer
    .apply(LoggerMiddleWare, Logger2MiddleWare)
    .exclude({ path: '/users/:id', method: RequestMethod.GET })
    .forRoutes(UsersController);
}
```

이렇게 하면 http://localhost:3000/users/test api 호출을 해도 미들웨어가 동작하지 않는다.

### 전역으로 사용

미들웨어는 전역으로 사용할 수 있다. main.ts에서 app.use() 에 사용할 미들웨어를 넣어주면 되는데, use 메소드는 클래스를 인자로 받을 수 없다. 따라서 전역으로 사용하려면 미들웨어를 함수로 만들어야 한다.

logger2를 함수로 변경해보자.

logger2.middleware.ts
```
import { NextFunction } from 'express';

export function Logger2MiddleWare(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`Request2...`);
  next();
}
```

main.ts에서 app.use(Logger2MiddleWare)를 넣어주고, api 호출을 해보자.

Request2...가 먼저 찍히고, Request...가 찍히는걸 볼 수 있다.

**함수로 만든 미들웨어는 DI 컨테이너를 사용할 수 없기 때문에, 프로바이더를 주입받아 사용할 수 없다는 단점이 있다.**

## 가드(Guard)

인가는 가드를 사용해서 구현한다. 가드를 만들어보자.

auth.guard.ts
```
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    return true;
  }
}
```

그리고 가드를 사용할 컨트롤러에서 UseGuards 데코레이터를 이용해 사용하면 된다.

app.controller.ts
```
@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

# 오류 발생!

오류가 발생해서 찾아보니, 가드를 넣어줄 때 함수를 실행시키는 형태로 넣어줘야 한다고 한다.

```
ERROR [ExceptionHandler] metatype is not a constructor TypeError: metatype is not a constructor
```

#### 해결 방법

이렇게 넣어주면 오류가 발생하지 않는다.

app.controller.ts
```
@UseGuards(AuthGuard())
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard())
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

이제 가드를 이용해서 인증, 인가를 구현해보자.

그에 앞서서 토큰을 발행해주는 라이브러리를 설치해야 한다.

```
$ npm i jsonwebtoken
$ npm i --save-dev @types/jsonwebtoken
```

그리고 AuthService를 생성해서, login 처리를 할 수 있는 함수와 토큰이 유효한지 체크하는 verify함수도 구현한다.

auth.service.ts
```
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  login(user: User) {
    const payload = { ...user };
    return jwt.sign(payload, 'SECRET_KEY', {
      expiresIn: '1d',
      audience: payload.email,
      issuer: 'issuer@email.com',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, 'SECRET_KEY') as (
        | jwt.JwtPayload
        | string
      ) &
        User;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
```

이제 AuthGuard를 만들어보자.

auth.guard.ts
```
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    const jwtString = request.headers.authorization?.split('Bearer ')[1];
    this.authService.verify(jwtString);
    return true;
  }
}
```

authorization가 undefined일수도 있기 때문에 ? 연산자로 authorization가 있을 경우에만 split 함수를 실행시키도록 했다.

이제 UsersService에서 사용하면 된다.

users.service.ts
```
@UseGuards(AuthGuard)
@Get('/:id')
async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
  return await this.usersService.getUserInfo(userId);
}
```

headers에 토큰을 넣지 않고 요청을 보내보면 Unauthorized를 반환한다.

근데 보통 AuthModule을 사용해서 jwtService랑 같이 조합해서 쓰던데, 예제에서는 왜 따로 jsonwebtoken 라이브러리를 사용해서 Guard를 직접 구현하는지 모르겠다.

## 로깅

### 내장 로거

Nest는 Logger를 제공한다. main.ts에서 간단하게 사용해보자.

main.ts
```
import { Logger } from '@nestjs/common';
const logger = new Logger();

logger.log('Logger');
logger.warn('Logger');
logger.error('Logger');
logger.verbose('Logger');
logger.debug('Logger');
```

로깅은 비활성화 할수도 있고, 로그 레벨을 지정해줄 수도 있다. 프로덕션 모드에서는 민감한 정보가 노출될수도 있기 때문에 verbose, debug 로그를 출력하지 않아야 한다.

main.ts
```
const app = await NestFactory.create(AppModule, {
  logger:
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'verbose', 'debug'],
});
```

하지만 내장 로거는 파일이나 데이터 베이스로 저장하는 기능을 제공하지 않는다. 따라서 커스텀 로거를 만들어서 사용해야 한다.

로거는 LoggerService 인터페이스를 상속받아서 구현하는데, 그러면 처음부터 다 구현해야하기 때문에 ConsoleLogger를 상속받는걸 추천해준다.

logger.ts
```
import { ConsoleLogger } from '@nestjs/common';

export class Logger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error.apply(this, arguments);
    this.saveDatabase();
  }

  private saveDatabase() {
    // DB 저장 로직
  }
}
```

그리고 모듈로 만들어서 extends 하고 AppModule에서 imports 해와서 쓰면 된다. (이쯤되면 흐름을 익혔기 때문에 자세한 설명은 생략,,)

로거는 전역으로도 사용 가능하다.

main.ts
```
app.useLogger(app.get(Logger));
```

하지만 내가 직접 로거를 만드는 것보단 잘 되어있는 라이브러리를 사용하는게 낫다. ㅎ

예제에서도 winston을 추천해서 winston 로거를 적용해보려고 한다. winston-daily-rotate-file는 로그 파일을 저장하는데 도움을 주는 라이브러리이다.

```
$ npm i nest-winston winston winston-daily-rotate-file
```

이제 winston을 AppModule에 주입해보자.

app.module.ts
```
WinstonModule.forRoot({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('MyApp', {
          prettyPrint: true,
        }),
      ),
    }),
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
}),
```

logs 폴더가 생기고, 각 error, info, wran 폴더도 생긴 것을 확인할 수 있다.

로그를 어떻게 저장할지 포맷은 생각해봐야 할 것 같다.
