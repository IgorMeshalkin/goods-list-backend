import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [FileService, ConfigService],
    exports: [FileService],
})
export class FileModule {}