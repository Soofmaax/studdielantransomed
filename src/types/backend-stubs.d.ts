// Minimal ambient module declarations for backend type-check in CI

declare module '@nestjs/common' {
  export const Injectable: (...args: any[]) => ClassDecorator;
  export const Global: (...args: any[]) => ClassDecorator;
  export function SetMetadata(key: string, value: any): MethodDecorator & ClassDecorator;

  export class Logger {
    constructor(context?: string);
    log(message?: any, ...optionalParams: any[]): void;
  }
  export class ValidationPipe {
    constructor(options?: any);
  }
  export class UnauthorizedException extends Error {}
  export class BadRequestException extends Error {}
  export class NotFoundException extends Error {}
  export class ConflictException extends Error {}

  export interface CanActivate {
    canActivate(context: any): boolean | Promise<boolean>;
  }

  export type ExceptionFilter = any;
  export function Catch(...args: any[]): ClassDecorator;
  export interface ArgumentsHost {
    switchToHttp(): {
      getResponse<T = any>(): T;
      getRequest<T = any>(): T;
    };
  }
  export interface ExecutionContext {
    switchToHttp(): {
      getResponse<T = any>(): T;
      getRequest<T = any>(): T;
    };
    getHandler(): any;
    getClass(): any;
  }
  export class HttpException extends Error {
    getStatus(): number;
    message: string;
  }
  export enum HttpStatus {
    INTERNAL_SERVER_ERROR = 500,
  }
  export type NestInterceptor = any;
  export type CallHandler = any;

  export function Module(metadata: any): ClassDecorator;
  export function Controller(path?: string): ClassDecorator;
  export function Get(path?: string): MethodDecorator;
  export function Post(path?: string): MethodDecorator;
  export function Put(path?: string): MethodDecorator;
  export function Delete(path?: string): MethodDecorator;
  export function Body(...args: any[]): ParameterDecorator;
  export function Param(name?: string): ParameterDecorator;
  export function UseGuards(...guards: any[]): MethodDecorator & ClassDecorator;

  export interface OnModuleInit {
    onModuleInit(): any;
  }
  export interface OnModuleDestroy {
    onModuleDestroy(): any;
  }
}

declare module '@nestjs/core' {
  export const NestFactory: {
    create(module: any): Promise<any>;
  };
  export class Reflector {
    get<T = any>(key: any, target: any): T;
    getAllAndOverride<T = any>(key: any, targets: any[]): T | undefined;
  }
}

declare module '@nestjs/swagger' {
  export const ApiTags: (...args: any[]) => ClassDecorator;
  export const ApiOperation: (...args: any[]) => MethodDecorator;
  export const ApiResponse: (...args: any[]) => MethodDecorator;
  export const ApiBearerAuth: (...args: any[]) => ClassDecorator;
  export const ApiProperty: (options?: any) => PropertyDecorator;

  export class DocumentBuilder {
    setTitle(title: string): this;
    setDescription(description: string): this;
    setVersion(version: string): this;
    addBearerAuth(): this;
    build(): any;
  }

  export const SwaggerModule: {
    createDocument(app: any, config: any): any;
    setup(path: string, app: any, document: any): void;
  };

  export function PartialType<T>(classRef: new () => T): new () => Partial<T>;
}

declare module '@nestjs/terminus' {
  export const TerminusModule: any;
  export type HealthIndicatorResult = any;
  export class HealthIndicator {
    protected getStatus(
      key: string,
      isHealthy: boolean,
      details?: any
    ): HealthIndicatorResult;
  }
  export const HealthCheck: (...args: any[]) => MethodDecorator;
  export class HealthCheckService {
    check(indicators: Array<() => any>): any;
  }
  export class PrismaHealthIndicator extends HealthIndicator {
    pingCheck(key: string): Promise<HealthIndicatorResult>;
  }
}

declare module '@nestjs/testing' {
  export const Test: {
    createTestingModule(options: any): {
      compile(): Promise<TestingModule>;
    };
  };
  export interface TestingModule {
    get<T>(token: any): T;
  }
}

declare module '@nestjs/config' {
  export const ConfigModule: {
    forRoot(options?: any): any;
  };
  export class ConfigService {
    get<T = any>(key: string, defaultValue?: T): T;
  }
}

declare module '@nestjs/jwt' {
  export const JwtModule: {
    register(options: any): any;
    registerAsync(options: any): any;
  };
  export class JwtService {
    sign(payload: any, options?: any): string;
  }
}

declare module '@nestjs/passport' {
  export function AuthGuard(strategy?: string): any;
  export const PassportModule: {
    register(options: any): any;
  };
  export function PassportStrategy<T = any>(strategy: T): any;
}

declare module 'passport-jwt' {
  export const Strategy: any;
  export const ExtractJwt: any;
}

declare module 'class-validator' {
  export const IsString: any;
  export const IsEmail: any;
  export const MinLength: any;
  export const IsEnum: any;
  export const IsNumber: any;
  export const Min: any;
  export const Max: any;
  export const Length: any;
  export const IsDateString: any;
}

declare module 'rxjs' {
  export type Observable<T = any> = any;
}

declare module 'rxjs/operators' {
  export const tap: any;
}

declare module 'express' {
  export interface Response {
    statusCode: number;
    status(code: number): Response;
    json(body: any): void;
  }
}