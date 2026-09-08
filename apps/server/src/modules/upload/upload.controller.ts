import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

const UPLOAD_DIR = './uploads';

@ApiTags('文件上传')
@ApiBearerAuth()
@Controller('upload')
export class UploadController {
  @Post()
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        const ok = /image\/(png|jpe?g|gif|webp|svg\+xml)/.test(file.mimetype);
        cb(ok ? null : new BadRequestException('仅支持图片格式'), ok);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('未接收到文件');
    return {
      url: `/uploads/${file.filename}`,
      name: file.originalname,
      size: file.size,
    };
  }
}
