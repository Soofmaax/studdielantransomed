// Minimal ambient module declarations for backend type-check in CI

declare module '@nestjs/common' {
  export const Injectable: (...args: any[]) => ClassDecorator;
  export class Logger {
    constructor(context?: string);
    log(message?: any, ...optionalParams: any[]): void;
  }
  export class ValidationPipe {
    constructor(options?: any);
  }
  export type ExceptionFilter = any;
  export function Catch(...args: any[]): ClassDecorator;
  export type ArgumentsHost = any;
  export class HttpException extends Error {
    getStatus(): number;
    message: string;
  }
  export enum HttpStatus {
    INTERNAL_SERVER_ERROR = 500,
  }
  export type NestInterceptor = any;
  export type ExecutionContext = any;
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
  export class NotFoundException extends Error {}
  export class ConflictException extends Error {}
}

declare module '@nestjs/core' {
  export const NestFactory: {
    create(module: any): Promise<any>;
  };
}

declare module '@nestjs/swagger' {
  export const ApiTags: (...args: any[]) => ClassDecorator;
  export const ApiOperation: (...args: any[]) => MethodDecorator;
  export const ApiResponse: (...args: any[]) => MethodDecorator;
  export const ApiBearerAuth: (...args: any[]) => ClassDecorator;

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
  export type HealthIndicatorResult = any;
  export class HealthIndicator {
    protected getStatus(
      key: string,
      isHealthy: boolean,
      details?: any
    ): HealthIndicatorResult;
  }
}

declare module '@nestjs/testing' {
  export const Test: any;
  export type TestingModule = any;
}

declare module '@nestjs/config' {
  export const ConfigModule: {
    forRoot(options?: any): any;
  };
}

declare module '@nestjs/jwt' {
  export class JwtService {
    sign(payload: any, options?: any): string;
  }
}

declare module '@nestjs/passport' {}

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
  }
}