import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentsController } from './documents.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Document])],
    controllers: [DocumentsController],
})
export class DocumentsModule {}
