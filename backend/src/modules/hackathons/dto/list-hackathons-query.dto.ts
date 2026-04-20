import { ApiPropertyOptional } from '@nestjs/swagger';
import { SourcePlatform } from '@prisma/client';
import { IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ListHackathonsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @ApiPropertyOptional({ description: 'Theme filter' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  theme?: string;

  @ApiPropertyOptional({ enum: ['remote', 'irl', 'hybrid'] })
  @IsOptional()
  @IsIn(['remote', 'irl', 'hybrid'])
  format?: 'remote' | 'irl' | 'hybrid';

  @ApiPropertyOptional({ description: 'Vibe / tag filter' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  vibe?: string;

  @ApiPropertyOptional({ enum: SourcePlatform })
  @IsOptional()
  @IsEnum(SourcePlatform)
  source?: SourcePlatform;

  @ApiPropertyOptional({ enum: ['trending', 'deadline', 'recent', 'ranking'] })
  @IsOptional()
  @IsIn(['trending', 'deadline', 'recent', 'ranking'])
  sort?: 'trending' | 'deadline' | 'recent' | 'ranking' = 'trending';
}
