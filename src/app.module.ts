import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {typeOrmConfig} from './config/typeorm.config';
import {GoodModule} from "./modules/entity-modules/good/good.module";
import {FileModule} from "./modules/file/file.module";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        GoodModule,
        FileModule
    ],
})
export class AppModule {
}
