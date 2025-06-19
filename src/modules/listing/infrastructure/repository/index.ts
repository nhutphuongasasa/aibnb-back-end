import { BaseCommandRepository, BaseQueryRepository, BaseRepository } from "../../../../shared/repository/repo-prisma";
import { LISTING_MODEL } from "../../interface";
import { ListingCondDTO } from "../../model/dto";
import { Listing } from "../../model/model";

export class ListingRepository extends BaseRepository<Listing, ListingCondDTO>{
    constructor(){
        super(
            new UserQueryRepository(),
            new UserCommandRepository()
        )
    }
}

export class UserQueryRepository extends BaseQueryRepository<Listing, ListingCondDTO>{
    constructor(  ){
        super(LISTING_MODEL)
    }
}

export class UserCommandRepository extends BaseCommandRepository<Listing>{
    constructor(){
        super(LISTING_MODEL)
    }
}
