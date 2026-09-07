import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('系统')
@Controller()
export class AppController {
  @Public()
  @Get('health')
  health() {
    return { status: 'up', ts: Date.now() };
  }
}
