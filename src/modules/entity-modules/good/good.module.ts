import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodController } from './good.controller';
import {Good} from "../../../entities/good/good.entity";
import {GoodService} from "./good.service";
import {FileModule} from "../../file/file.module";

@Module({
    imports: [FileModule, TypeOrmModule.forFeature([Good])],
    controllers: [GoodController],
    providers: [GoodService],
    exports: [GoodService],
})
export class GoodModule {}
