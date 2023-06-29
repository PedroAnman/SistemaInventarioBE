import { IPaginationOptions } from './pagination-options.interface';
import { IProduct } from './product.interface';

export interface IVariablesData {
    id?: string | number;
    text?: string;
    product?: IProduct;
    products?: [IProduct];
    pagination?: IPaginationOptions;
}