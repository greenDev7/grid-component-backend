import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './test_db.sqlite',
      synchronize: true,
      autoLoadEntities: true,
    }), 
    DocumentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
