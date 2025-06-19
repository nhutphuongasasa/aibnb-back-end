import { IUseCase } from "../../../shared/interface";
import {  ReservationCondDTO, ReservationCreateDTO, ReservationResponse } from "../model/dto";

export interface IReservationUseCase extends IUseCase<ReservationCreateDTO, ReservationCondDTO, ReservationResponse>{
    deleteReservation(id: string, userId: string): Promise<any>
}

export const RESERVATION_MODEL = 'reservation' as const