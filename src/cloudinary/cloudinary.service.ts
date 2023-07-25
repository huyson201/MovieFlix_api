import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(config: ConfigService) {
    cloudinary.v2.config({
      secure: true,
      cloud_name: config.getOrThrow('CLOUDINARY_NAME'),
      api_key: config.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: config.getOrThrow('CLOUDINARY_SECRET'),
    });
  }

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({}, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        })
        .end(file.buffer);
    });
  }

  deleteImage(publicId: string) {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      });
    });
  }
}
