import { Brand } from "../../../isp/brand/Models/BrandResponse";
import { Category } from "../../category/models/CategoryResponse";
import { Presentation } from "../../presentation/models/PresentationResponse";

export interface MaterialResponse {
    data: Material[];
}

export interface MaterialSingleResponse {
    data: Material;
}

export interface Material {
    id: number;
    code: string;
    name: string;
    category: Category;
    presentation: Presentation;
    brand: Brand;
    min: number;
    type: string;
    image: null;
    status: number;
}


