import { CreateDocumentDto } from './create-document.dto';

export class PagingDocumentDto extends CreateDocumentDto {
  paging: {};
  sorting: {};
  filtering: {};
}
