import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
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
        @Query('sort') sort: string = 'down_price',
        @Query('minPrice') minPrice: number = 0,
        @Query('maxPrice') maxPrice: number = Infinity
    ): Promise<GoodDto[]> {
        try {
            const rawGoodList = await this.goodService.findMany(limit, offset, sort, minPrice, maxPrice);
            return rawGoodList.map(rawItem => plainToInstance(GoodDto, rawItem, {excludeExtraneousValues: true}));
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    @Get(':uuid')
    async findOne(@Param('uuid') uuid: string): Promise<GoodDto> {
        try {
            const foundedGood = await this.goodService.findByUuid(uuid);
            if (!foundedGood) {
                throw new NotFoundException('Good not found');
            }
            return plainToInstance(GoodDto, foundedGood, {excludeExtraneousValues: true});
        } catch (err) {
            console.error(err);
            throw err;
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
            throw err;
        }
    }

    @Post(':uuid')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Body() goodDto: GoodDto,
        @Param('uuid') uuid: string,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<GoodDto> {
        try {
            const updatedGood = await this.goodService.update(goodDto, uuid, file);
            return plainToInstance(GoodDto, updatedGood, {excludeExtraneousValues: true});
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
