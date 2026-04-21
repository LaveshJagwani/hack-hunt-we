import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

class EnvVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^rediss?:\/\//, {
    message: 'REDIS_URL must start with redis:// or rediss://',
  })
  REDIS_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  @IsEmail()
  ADMIN_SEED_EMAIL!: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_SEED_PASSWORD!: string;

  @IsString()
  CORS_ORIGINS!: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL?: string;

  @IsInt()
  @Min(1)
  @Max(3600)
  THROTTLE_TTL!: number;

  @IsInt()
  @Min(1)
  @Max(10000)
  THROTTLE_LIMIT!: number;

  @IsInt()
  @Min(1)
  @Max(20)
  SCRAPE_CONCURRENCY!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  SCRAPE_RETRY_COUNT!: number;

  @IsInt()
  @Min(1000)
  @Max(120000)
  SCRAPE_REQUEST_TIMEOUT_MS!: number;
}

export function validateEnv(config: Record<string, unknown>): EnvVariables {
  const validatedConfig = plainToInstance(EnvVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
