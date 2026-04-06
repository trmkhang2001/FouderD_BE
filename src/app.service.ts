import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      status: 'ok',
      service: 'erp-api',
      ts: new Date().toISOString(),
    };
  }
}
