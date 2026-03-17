import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssistantService } from './assistant.service';
import { AskQuestionDto, AssistantResponseDto } from './dto/ask-question.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('assistant')
@Controller('assistant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) { }

  @Post('ask')
  @ApiOperation({ summary: 'Ask a question about your events' })
  @ApiResponse({ status: 200, type: AssistantResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async ask(
    @Body() dto: AskQuestionDto,
    @Request() req,
  ): Promise<AssistantResponseDto> {
    const answer = await this.assistantService.processQuestion(
      req.user.id,
      dto.question,
    );
    return { answer };
  }
}