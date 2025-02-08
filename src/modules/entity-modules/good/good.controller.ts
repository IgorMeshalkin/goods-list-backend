import {Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors} from '@nestjs/common';
import {GoodService} from "./good.service";
import {GoodDto} from "../../../entities/good/good.dto";
import {plainToInstance} from "class-transformer";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('goods')
export class GoodController {
    constructor(private readonly goodService: GoodService) {
    }

    @Get()
    async findMany(
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0,
        @Query('sort') sort: string = 'up_price',
        @Query('minPrice') minPrice: number = 0,  // Дефолтное значение 0
        @Query('maxPrice') maxPrice: number = Infinity  // Дефолтное значение бесконечность
    ): Promise<GoodDto[]> {
        try {
            const rawGoodList = await this.goodService.findMany(limit, offset, sort, minPrice, maxPrice);
            return rawGoodList.map(rawItem => plainToInstance(GoodDto, rawItem, {excludeExtraneousValues: true}));
        } catch (err) {
            console.error(err);
            throw new Error('Failed to fetch good');
        }
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() goodDto: GoodDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<GoodDto> {
        try {
            const createdGood = await this.goodService.create(goodDto, file);
            return plainToInstance(GoodDto, createdGood, {excludeExtraneousValues: true});
        } catch (err) {
            console.error(err);
            throw new Error('Failed to create good');
        }
    }
}
