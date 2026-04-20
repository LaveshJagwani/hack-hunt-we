import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { QueuesModule } from '../queues/queues.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [AuthModule, QueuesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
