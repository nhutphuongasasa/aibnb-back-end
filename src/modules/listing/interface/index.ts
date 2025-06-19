import { IUseCase } from "../../../shared/interface";
import { ListingCondDTO, ListingCreateDTO, ListingResponse } from "../model/dto";

export interface IListingUseCase extends IUseCase<ListingCreateDTO, ListingCondDTO, ListingResponse> {
    getListingMe(userId: string): Promise<any>
    deleteListingMe(UserId: string, id: string): Promise<any>
}

export const LISTING_MODEL = "listing" as const;