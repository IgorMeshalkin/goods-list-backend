import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Good} from "../../../entities/good/good.entity";
import {GoodDto} from "../../../entities/good/good.dto";
import {plainToInstance} from "class-transformer";
import {FileService} from "../../file/file.service";

@Injectable()
export class GoodService {
    constructor(
        @InjectRepository(Good)
        private readonly goodRepository: Repository<Good>,
        private readonly fileService: FileService,
    ) {
    }

    /**
     * returns list of goods
     */
    async findAll(limit: number, offset: number, sort: string): Promise<Good[]> {
        const sortDirection = sort.startsWith('up') ? 'ASC' : 'DESC';

        return this.goodRepository.createQueryBuilder('good')
            .take(limit)
            .skip(offset)
            .orderBy(
                `CASE WHEN "good"."discounted_price" IS NOT NULL THEN "good"."discounted_price" ELSE "good"."price" END`,
                sortDirection
            )
            .getMany();
    }

    /**
     * creates new good file
     */
    async create(goodDto: GoodDto, file: Express.Multer.File | null): Promise<Good> {
        // creates new typeorm entity good
        const newGood = await this.goodRepository.create(plainToInstance(Good, goodDto));

        // saves image file if it exists
        if (file) {
            newGood.image = await this.fileService.saveImage(file);
        }

        // saves good to database
        return this.goodRepository.save(newGood);
    }
}
