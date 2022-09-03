import { Injectable } from '@nestjs/common';
import { DataSource, Equal, FindOperator, InsertResult, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not, Raw } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PagingDocumentDto } from './dto/paging-document.dto';
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

  async findPaginated(pagingDocumentDto: PagingDocumentDto) {

    let options = {
      skip: pagingDocumentDto.paging['skip'],
      take: pagingDocumentDto.paging['take'],
      order: pagingDocumentDto.sorting,
    };

    const filter = pagingDocumentDto.filtering;

    let filters = {};

    // Цикл для динамического формирования фильтров
    for (var column in filter) {
      if (Object.prototype.hasOwnProperty.call(filter, column)) {
        const valueToFilter = filter[column]['valueToFilter'];
        const comparisonOperator = filter[column]['comparisonOperator'];
        const columnType = filter[column]['columnType'];
        if (valueToFilter || valueToFilter === false) {
          filters[column] = this.operatorMapping(
            columnType,
            comparisonOperator,
            valueToFilter,
          );
        }
      }
    }

    options['where'] = filters;

    const [documents, count] = await this.dataSource.getRepository(Document).findAndCount(
      options,
    );

    return {
      documents,
      count,
    };

  }

  operatorMapping(
    columnType: string,
    comparisonOperator: string,
    valueToFilter: any,
  ): FindOperator<any> {
    switch (comparisonOperator) {
      case 'likeOperator':
        if (['number', 'datetime-local'].includes(columnType))
          return Raw(
            (alias) =>
              `lower(cast(${alias} as text)) like '%${(
                valueToFilter + ''
              ).toLowerCase()}%'`,
          );
        // if (['string'].includes(columnType))        
        return Raw(
          (alias) =>
            `lower(${alias}) like '%${(valueToFilter + '').toLowerCase()}%'`,
        );
      case 'notLikeOperator':
        if (['number', 'datetime-local'].includes(columnType))
          return Raw(
            (alias) =>
              `lower(cast(${alias} as text)) not like '%${(
                valueToFilter + ''
              ).toLowerCase()}%'`,
          );
        // if (['string'].includes(columnType))
        return Raw(
          (alias) =>
            `lower(${alias}) not like '%${(
              valueToFilter + ''
            ).toLowerCase()}%'`,
        );
      case 'greaterThanOperator':
        return MoreThan(valueToFilter);
      case 'greaterThanOrEqualOperator':
        return MoreThanOrEqual(valueToFilter);
      case 'lessThanOperator':
        return LessThan(valueToFilter);
      case 'lessThanOrEqualOperator':
        return LessThanOrEqual(valueToFilter);
      case 'notEqualOperator':
        return Not(valueToFilter);
      default:
        // equalOperator
        return Equal(valueToFilter);
    }
  }
}
