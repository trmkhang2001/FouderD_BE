import { Module } from '@nestjs/common';
import { LadipageController } from './ladipage.controller';
import { LadipageService } from './ladipage.service';

@Module({
  controllers: [LadipageController],
  providers: [LadipageService],
})
export class LadipageModule {}

