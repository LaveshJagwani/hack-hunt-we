import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './modules/prisma/prisma.module';
import { QueueWorkersModule } from './modules/queues/queue-workers.module';
import { QueuesModule } from './modules/queues/queues.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { RedisModule } from './modules/redis/redis.module';
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
          transport:
            configService.get<string>('app.nodeEnv') === 'development'
              ? {
                  target: 'pino-pretty',
                  options: { singleLine: true, colorize: true },
                }
              : undefined,
        },
      }),
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
      }),
    }),
    PrismaModule,
    RedisModule,
    RankingModule,
    ScrapingModule,
    QueuesModule,
    QueueWorkersModule,
  ],
})
export class WorkerModule {}
