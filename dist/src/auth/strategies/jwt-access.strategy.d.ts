import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { JwtUserPayload } from '../types/jwt-user.payload';
declare const JwtAccessStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAccessStrategy extends JwtAccessStrategy_base {
    constructor(config: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        role: JwtUserPayload['role'];
    }): JwtUserPayload;
}
export {};
