import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { Event } from '../database/entities/event.entity';
import { User } from '../database/entities/user.entity';
import { Participant } from '../database/entities/participant.entity';
import { Tag } from '../database/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, User, Participant, Tag]),
  ],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule { }