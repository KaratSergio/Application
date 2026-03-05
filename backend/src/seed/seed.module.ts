import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../database/entities/user.entity';
import { Event } from '../database/entities/event.entity';
import { Participant } from '../database/entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Event, Participant])],
  providers: [SeedService],
})
export class SeedModule { }
