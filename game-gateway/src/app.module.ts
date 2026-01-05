import { Module } from '@nestjs/common';
import { GameModule } from './gateway/game.module';

@Module({
  imports: [GameModule],
})
export class AppModule {}
