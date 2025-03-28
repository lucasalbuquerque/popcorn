import { Module } from '@nestjs/common';
import { AIChatController } from './aichat.controller';
import { AIChatService } from './aichat.service';
import { AIChat } from './entities/aichat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([AIChat]), ProductsModule],
  controllers: [AIChatController],
  providers: [AIChatService],
})
export class AIChatModule {}
