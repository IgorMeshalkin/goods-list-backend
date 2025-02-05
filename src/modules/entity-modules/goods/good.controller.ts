import { Controller, Get, Post, Body } from '@nestjs/common';
import {GoodService} from "./good.service";
import {Good} from "../../../entities/good.entity";

@Controller('goods')
export class GoodController {
    constructor(private readonly goodService: GoodService) {}

    @Get()
    findAll(): Promise<Good[]> {
        return this.goodService.findAll();
    }

    @Post()
    create(@Body() good: Good): Promise<Good> {
        return this.goodService.create();
    }
}
