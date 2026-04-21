import { Module } from '@nestjs/common';
import { QueuesModule } from '../queues/queues.module';
import { SchedulingService } from './scheduling.service';

@Module({
  imports: [QueuesModule],
  providers: [SchedulingService],
})
export class SchedulingModule {}
