import { ApiPropertyOptional } from '@nestjs/swagger';
import { SourcePlatform } from '@prisma/client';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

export class RunScrapeDto {
  @ApiPropertyOptional({ enum: SourcePlatform, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(SourcePlatform, { each: true })
  sources?: SourcePlatform[];
}
