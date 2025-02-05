import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Good extends BaseEntity {
    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ type: 'decimal', nullable: true , name: 'discounted_price' })
    discountedPrice?: number;

    @Column({ unique: true })
    article : string;

    @Column()
    image : string;
}
