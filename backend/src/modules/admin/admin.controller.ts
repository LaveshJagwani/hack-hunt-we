import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { RunScrapeDto } from './dto/run-scrape.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/scrape')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('run')
  @ApiOperation({ summary: 'Trigger manual scraping run' })
  async runScrape(@Body() dto: RunScrapeDto) {
    return this.adminService.triggerScrape(dto);
  }
}
