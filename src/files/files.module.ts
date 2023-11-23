import { Module } from '@nestjs/common';
import { FilesService } from '@/files/files.service';
import { FilesController } from '@/files/files.controller';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService],
})
export class FilesModule {}
