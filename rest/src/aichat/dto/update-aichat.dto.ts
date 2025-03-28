import { PartialType } from '@nestjs/swagger';
import { CreateAIChatDto } from './create-aichat.dto';

export class UpdateAIChatDto extends PartialType(CreateAIChatDto) {}
