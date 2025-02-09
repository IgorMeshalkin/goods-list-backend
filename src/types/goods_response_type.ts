import {GoodDto} from "../entities/good/good.dto";

export type TGoodsResponse = {
    goods: GoodDto[],
    pagesCount: number
}