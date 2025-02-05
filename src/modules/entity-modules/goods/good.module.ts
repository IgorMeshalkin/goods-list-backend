import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodController } from './good.controller';
import {Good} from "../../../entities/good.entity";
import {GoodService} from "./good.service";

@Module({
    imports: [TypeOrmModule.forFeature([Good])],
    controllers: [GoodController],
    providers: [GoodService],
    exports: [GoodService],
})
export class GoodModule {}
