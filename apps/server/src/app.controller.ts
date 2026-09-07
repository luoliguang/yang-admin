import { Controller, Get } from '@nestjs/common';
import type { ApiResponse } from '@yang-admin/shared';

@Controller()
export class AppController {
  @Get('health')
  health(): ApiResponse<{ status: string; ts: number }> {
    return {
      code: 0,
      message: 'ok',
      data: { status: 'up', ts: Date.now() },
    };
  }
}
