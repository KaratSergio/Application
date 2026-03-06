import {
  Controller,
  Get, Post, Body, Patch, Param,
  Delete, UseGuards, Request,
  HttpCode, HttpStatus
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth,
  ApiOperation, ApiResponse
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all public events' })
  @ApiResponse({ status: 200, description: 'List of public events', type: [EventResponseDto] })
  async findAll(@Request() req) {
    const userId = req.user?.id;
    return this.eventsService.findAllPublic(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiResponse({ status: 200, description: 'Event details', type: EventResponseDto })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.eventsService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, description: 'Event created', type: EventResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - past date or validation error' })
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Event updated', type: EventResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - not organizer' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - not organizer' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join event' })
  @ApiResponse({ status: 201, description: 'Joined successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - event full or already joined' })
  async join(@Param('id') id: string, @Request() req) {
    return this.eventsService.join(id, req.user.id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave event' })
  @ApiResponse({ status: 201, description: 'Left successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - not a participant' })
  async leave(@Param('id') id: string, @Request() req) {
    return this.eventsService.leave(id, req.user.id);
  }
}