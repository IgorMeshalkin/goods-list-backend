import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    constructor(private readonly configService: ConfigService) {
    }

    static readonly uploadDir = path.join(process.cwd(), 'uploads');

    /**
     * uploads image file
     */
    async saveImage(file: Express.Multer.File): Promise<string> {
        // validates file type and size
        this.validateImage(file);

        // check upload directory exists and creates it if not exists.
        if (!fs.existsSync(FileService.uploadDir)) {
            fs.mkdirSync(FileService.uploadDir);
        }

        // creates file name
        const originalNameArray = file.originalname.split('.')
        const fileName = `img__${originalNameArray[0]}__${Date.now()}.${originalNameArray[1]}`;
        const uploadPath = path.join(FileService.uploadDir, fileName);

        // tries to save file to upload directory
        try {
            fs.writeFileSync(uploadPath, file.buffer);
            return fileName;
        } catch (error) {
            throw new InternalServerErrorException('Error while saving file');
        }
    }

    /**
     * deletes image file by filename
     */
    async deleteImage(fileName: string): Promise<void> {
        const filePath = path.join(FileService.uploadDir, fileName);

        // checks if file exists before attempting to delete
        if (!fs.existsSync(filePath)) {
            throw new BadRequestException(`File ${fileName} not found.`);
        }

        // tries to delete the file
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            throw new InternalServerErrorException('Error while deleting file');
        }
    }

    /**
     * validates image file before uploading
     */
    private validateImage(file: Express.Multer.File) {
        // gets image validation variables from .env
        const rawAllowedImgTypes = this.configService.get<string>('ALLOWED_IMG_TYPES');
        const allowedImgTypes = rawAllowedImgTypes ? rawAllowedImgTypes.split(',') : [];
        const maxImgSize = this.configService.get<number>('MAX_IMG_SIZE') || 0;

        // checks file type
        if (!allowedImgTypes.includes(file.mimetype)) {
            throw new BadRequestException(`Invalid file type. Only ${rawAllowedImgTypes} are allowed.`);
        }
        // checks file size
        if (file.size > maxImgSize) {
            throw new BadRequestException(`File size exceeds the ${maxImgSize} bytes limit.`);
        }
    }
}