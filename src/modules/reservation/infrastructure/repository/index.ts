import { BaseCommandRepository, BaseQueryRepository, BaseRepository } from "../../../../shared/repository/repo-prisma";
import { RESERVATION_MODEL } from "../../interface";
import { ReservationCondDTO, ReservationCreateDTO } from "../../model/dto";
import { Reservation } from "../../model/model";

export class ReservationRepository extends BaseRepository<Reservation, ReservationCondDTO>{
    constructor(){
        super(
            new ReservationQueryRepository(),
            new ReservationCommandRepository()
        )
    }
}

export class ReservationQueryRepository extends BaseQueryRepository<Reservation, ReservationCondDTO>{
    constructor(){
        super(RESERVATION_MODEL)
    }
}

export class ReservationCommandRepository extends BaseCommandRepository<Reservation>{
    constructor(){
        super(RESERVATION_MODEL)
    }
}