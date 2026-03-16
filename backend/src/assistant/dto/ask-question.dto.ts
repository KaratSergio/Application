import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AskQuestionDto {
  @ApiProperty({ example: 'What events am I attending this week?' })
  @IsString()
  @IsNotEmpty()
  question: string;
}

export class AssistantResponseDto {
  @ApiProperty()
  answer: string;
}