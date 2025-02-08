import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
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
    async findMany(limit: number, offset: number, sort: string, minPrice: number, maxPrice: number): Promise<Good[]> {
        // validates parameters before create query
        this.validateQueryParameters(limit, offset, sort, minPrice, maxPrice)

        // determines sort direction for database query
        const sortDirection = sort.startsWith('up') ? 'ASC' : 'DESC';

        // creates query
        let query = this.goodRepository.createQueryBuilder('good')
            .take(limit)
            .skip(offset)
            .orderBy(
                `CASE WHEN "good"."discounted_price" IS NOT NULL THEN "good"."discounted_price" ELSE "good"."price" END`,
                sortDirection
            );

        // adds minPrice parameter to query
        if (minPrice) {
            query = query.andWhere(
                `CASE WHEN "good"."discounted_price" IS NOT NULL THEN "good"."discounted_price" ELSE "good"."price" END >= :minPrice`,
                { minPrice }
            );
        }

        // adds maxPrice parameter to query
        if (maxPrice) {
            query = query.andWhere(
                `CASE WHEN "good"."discounted_price" IS NOT NULL THEN "good"."discounted_price" ELSE "good"."price" END <= :maxPrice`,
                { maxPrice }
            );
        }

        // executes query and returns result
        return query.getMany();
    }

    /**
     * returns good by uuid or null
     */
    async findByUuid(uuid: string): Promise<Good | null> {
        return await this.goodRepository.findOneBy({ uuid });
    }

    /**
     * creates new good
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

    /**
     * updates existed good
     */
    async update(goodDto: GoodDto, paramsUuid: string, file: Express.Multer.File | null): Promise<Good> {
        // gets updatable good from database to check
        const existedGood = await this.goodRepository.findOne({ where: { uuid: paramsUuid } });

        // checks exists updatable good
        if (!existedGood) {
            throw new NotFoundException(`Good with uuid: ${paramsUuid} does not exist`);
        }

        // tries to delete updatable good's image if it needs
        if (existedGood.image && file) {
            await this.fileService.deleteImage(existedGood.image);
        }

        // tries to save new image for updatable good if it needs
        if (file) {
            existedGood.image = await this.fileService.saveImage(file);
        }

        // puts new values to good object for update
        const { uuid,image, ...updatedGoodDto } = goodDto;
        Object.assign(existedGood, updatedGoodDto);

        // saves updates to database
        return this.goodRepository.save(existedGood);
    }

    /**
     * validates query parameters before execute query
     */
    private validateQueryParameters = (limit: number, offset: number, sort: string, minPrice: number, maxPrice: number) => {
        // checks limit is not NaN
        if (isNaN(limit)) {
            throw new BadRequestException('limit must be valid number.');
        }

        // checks limit is positive number
        if (limit <= 0) {
            throw new BadRequestException('limit must be positive number.');
        }

        // checks offset is not NaN
        if (isNaN(offset)) {
            throw new BadRequestException('offset must be valid number.');
        }

        // checks offset is positive number or zero
        if (offset < 0) {
            throw new BadRequestException('offset must be positive number or zero.');
        }

        // checks sort string
        if (!/^(up|down)_/.test(sort)) {
            throw new BadRequestException('sort must start with "up" or "down".');
        }

        // checks minPrice is not NaN
        if (isNaN(minPrice)) {
            throw new BadRequestException('minPrice must be valid number.');
        }

        // checks maxPrice is not NaN
        if (isNaN(maxPrice)) {
            throw new BadRequestException('maxPrice must be valid number.');
        }

        // checks minPrice is positive number or zero
        if (minPrice < 0) {
            throw new BadRequestException('minPrice must be positive number or zero.');
        }

        // checks minPrice less than maxPrice
        if (minPrice >= maxPrice) {
            throw new BadRequestException('minPrice must be less than maxPrice');
        }
    }
}
