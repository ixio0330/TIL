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

**오류 발생 !**

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
