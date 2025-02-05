import {
    BaseEntity as TypeOrmBaseEntity,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * объединяет в себе общие для всех сущностей поля
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @Column({type: 'boolean', default: false, name: 'is_deleted'})
    isDeleted: boolean;
}
