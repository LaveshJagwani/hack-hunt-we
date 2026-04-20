import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListHackathonsQueryDto } from './dto/list-hackathons-query.dto';
import { HackathonsService } from './hackathons.service';

@ApiTags('Hackathons')
@Controller('hackathons')
export class HackathonsController {
  constructor(private readonly hackathonsService: HackathonsService) {}

  @Get()
  @ApiOperation({ summary: 'List hackathons with pagination and filters' })
  async list(@Query() query: ListHackathonsQueryDto) {
    return this.hackathonsService.listHackathons(query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending hackathons' })
  async trending(@Query('limit') limit?: string) {
    const parsedLimit = limit ? Number(limit) : 12;
    return this.hackathonsService.getTrending(
      Number.isNaN(parsedLimit) ? 12 : parsedLimit,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search hackathons by query term' })
  async search(@Query('q') q: string, @Query() query: ListHackathonsQueryDto) {
    if (!q?.trim()) {
      throw new BadRequestException('Query parameter "q" is required');
    }
    return this.hackathonsService.searchHackathons(q, query);
  }

  @Get('filter')
  @ApiOperation({ summary: 'Get available filter options' })
  async filter() {
    return this.hackathonsService.getFilters();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get hackathon details by slug' })
  async bySlug(@Param('slug') slug: string) {
    return this.hackathonsService.getHackathonBySlug(slug);
  }
}
