import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { HackathonsModule } from './modules/hackathons/hackathons.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { QueuesModule } from './modules/queues/queues.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { RedisModule } from './modules/redis/redis.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { ScrapingModule } from './modules/scraping/scraping.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate: validateEnv,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('app.logLevel', 'info'),
          redact: ['req.headers.authorization', 'req.headers.cookie'],
          transport:
            configService.get<string>('app.nodeEnv') === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:standard',
                  },
                }
              : undefined,
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('app.throttleTtl', 60) * 1000,
          limit: configService.get<number>('app.throttleLimit', 120),
        },
      ],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host', 'localhost'),
          port: configService.get<number>('redis.port', 6379),
          password: configService.get<string>('redis.password'),
          db: configService.get<number>('redis.db', 0),
        },
        defaultJobOptions: {
          removeOnComplete: 200,
          removeOnFail: 500,
        },
      }),
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    RankingModule,
    ScrapingModule,
    QueuesModule,
    HealthModule,
    HackathonsModule,
    AuthModule,
    AdminModule,
    SchedulingModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
