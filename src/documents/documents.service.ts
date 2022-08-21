import { Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {

  constructor(private dataSource: DataSource) { }

  async findAllDocuments(): Promise<Document[]> {
    return await this.dataSource.getRepository(Document).find();
  }
  
  async createDocument(createDocumentDto: CreateDocumentDto): Promise<InsertResult> {
    return await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Document)
      .values([
        {
          cipher: createDocumentDto.cipher,
          createdOn: createDocumentDto.createdOn,
          inArchive: createDocumentDto.inArchive,
        },
      ])
      .execute();
  }  
}
