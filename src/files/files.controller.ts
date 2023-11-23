import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FilesService } from '@/files/files.service';
import { UpdateFileDto } from '@/files/dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@/decorator/customize';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            /^(application\/msword|image\/jpeg|image\/png|application\/pdf|text\/plain)$/i,
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 20 }) // 20mb
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body('folderName') folderName: string,
  ) {
    if (!folderName) folderName = '';
    return this.cloudinaryService.uploadFile(file, folderName);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
