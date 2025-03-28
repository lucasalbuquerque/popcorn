import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AIChatService } from './aichat.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/middleware.guard';

@ApiTags('AI Chat')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class AIChatController {
  constructor(private aiChatService: AIChatService) {}

  @Post()
  async chat(
    @CurrentUser() user,
    @Body() body: { query: string; dealId: string },
  ) {
    try {
      const response = await this.aiChatService.generateResponse(body.query);

      return { response };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }
}
