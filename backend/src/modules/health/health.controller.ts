import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({
    description: 'Service health status',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-01-01T12:00:00.000Z',
        checks: { database: 'ok', redis: 'ok' },
      },
    },
  })
  async getHealth() {
    return this.healthService.getHealth();
  }
}
