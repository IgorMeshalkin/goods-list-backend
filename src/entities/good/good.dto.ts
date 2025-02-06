import {IsNumber, IsOptional, IsString, Min} from "class-validator";
import {Expose, Transform} from "class-transformer";

export class GoodDto {
    @IsOptional()
    @IsString()
    @Expose()
    uuid?: string;

    @IsString()
    @Expose()
    name: string;

    @IsOptional()
    @IsString()
    @Expose()
    description?: string;

    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    @Expose()
    price: number;

    @IsOptional()
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
    @Min(0)
    @Transform(({ value }) => value ? parseFloat(value) : value, { toClassOnly: true })
    @Expose()
    discountedPrice?: number;

    @IsString()
    @Expose()
    article : string;

    @IsOptional()
    @IsString()
    @Expose()
    image?: string;
}