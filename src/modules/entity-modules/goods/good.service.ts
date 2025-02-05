import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Good} from "../../../entities/good.entity";

@Injectable()
export class GoodService {
    constructor(
        @InjectRepository(Good) // Внедряем репозиторий для сущности Good
        private readonly goodRepository: Repository<Good>, // Теперь работаем с обычным Repository
    ) {}

    // Пример метода, который использует репозиторий
    async findAll(): Promise<Good[]> {
        return this.goodRepository.find();
    }

    // // Метод для получения товара по ID
    // async findOne(id: string): Promise<Good> {
    //     return this.goodRepository.findOne(id);
    // }
    //

    // Метод для создания товара
    async create(): Promise<Good> {
        const good = this.goodRepository.create({
            name: 'Товар',
            description: 'Описание товара',
            price: 50,
            discountedPrice: 35,
            article: 'ADT-32 PT',
            image: 'сслыка на картинку'
        });
        return this.goodRepository.save(good);
    }
    //
    // // Метод для обновления товара
    // async update(id: string, goodData: Partial<Good>): Promise<Good> {
    //     await this.goodRepository.update(id, goodData);
    //     return this.goodRepository.findOne(id);
    // }
    //
    // // Метод для удаления товара
    // async remove(id: string): Promise<void> {
    //     await this.goodRepository.delete(id);
    // }
}
