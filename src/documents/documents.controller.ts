import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import 
{ Body, 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
  Post 
} from '@nestjs/common';

@Controller('documents')
export class DocumentsController {

  constructor(private readonly documentService: DocumentsService) { }

  @Get()
  findAll() {
    return this.documentService.findAllDocuments();
  }

  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService
      .createDocument(createDocumentDto)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new HttpException('Произошла какая-то ошибка при создании документа =(: ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      })
  }
}
