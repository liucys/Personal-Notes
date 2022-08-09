使用 JWT 进行身份认证

- 需要安装的依赖

```
npm install --save @nestjs/passport passport @nestjs/jwt passport-jwt

npm install --save-dev @types/passport-jwt
```

基于 `README` 文件实现内容进行案例讲解

- 首先构建目录结构 `src/auth`，并在`auth`文件夹下分别创建文件：`auth.controller.ts`、`auth.service.ts`、 `auth.module.ts`、 `auth.dto.ts`、 `jwtAuthGuard.ts`、`jwtStrategy.ts`。
- 配置 `jwtAuthGuard.ts` 文件

```TS
// jwtAuthGuard.ts
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = 'Nzto]G9F.r2%eV=ejC!+%G2zCPHd@G?q';
// 自定义构造器
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 通过判断是否含有自定义构造器Public，从而判断是否需要进行jwt验证
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

```

- 配置 `jwtStrategy.ts` 文件

```TS
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // false，表示只处理没有过期的请求委托
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  // 这将会自动解析JWT签名，并将返回值附加到Request对象上。
  async validate(payload: any) {
    return {
      id: payload.sub,
      avatar: payload.avatar,
      name: payload.name,
      role: payload.role,
    };
  }
}

```

- 配置 `auth.dto.ts` 文件

```TS
import { IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({ message: '登录账户不能为空' })
  readonly username: string;

  @IsNotEmpty({ message: '登录密码不能为空' })
  readonly password: string;
}

```

- 配置 `auth.service.ts` 文件

```TS
import { ErrorResponse, IResponse, SuccessResponse } from '@/helper/response';
import { UsersService } from '@/service/user';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.queryByUserName(username);
    if (user && (await this.userService.verifyPwd(password, user.password))) {
      return user;
    }
    return null;
  }

  /**
   * 登录
   * @param form
   * @returns
   */
  async login(form: AuthLoginDto): Promise<IResponse> {
    try {
      const { username, password } = form;
      const user = await this.userService.queryByUserName(username);
      if (!user) return new ErrorResponse('登录账户不正确');
      const pwdStatus = await this.userService.verifyPwd(
        password,
        user.password,
      );
      if (!pwdStatus) return new ErrorResponse('登录密码错误');
      const payload = {
        name: user.name,
        avatar: user.avatar,
        sub: user.id,
        role: user.role,
      };
      return new SuccessResponse({
        access_token: this.jwtService.sign(payload),
      });
    } catch (error) {
      return new ErrorResponse(error.message);
    }
  }

  /**
   * 获取当前用户
   * @param req
   * @returns
   */
  async currentUser(req: any): Promise<IResponse> {
    try {
      return new SuccessResponse(req.user);
    } catch (error) {
      return new ErrorResponse(error.message);
    }
  }
}

```

- 配置 `auth.controller.ts`文件

```TS
import { IResponse } from '@/helper/response';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthLoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard, Public } from './jwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() // 使用该装饰器声明此接口为开放的,不需要JWT验证
  @Post('/login')
  async login(@Body() form: AuthLoginDto): Promise<IResponse> {
    return this.authService.login(form);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/currentUser')
  async currentUser(@Request() req): Promise<IResponse> {
    return this.authService.currentUser(req);
  }
}

```

- 配置 `auth.module.ts` 文件

```TS
import { UsersModule } from '@/module/user';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwtStrategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: {
          expiresIn: '60s',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

```

- 然后，我们在 `app.module.ts`文件中进行引入配置即可

```TS
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import parseDev from '@@/config';
import { UsersModule } from './module/user';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuthGuard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局注入
      load: [parseDev], // 加载配置
    }),
    // 注入数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }], // 全局注册启用身份验证
})
export class AppModule {}

```
