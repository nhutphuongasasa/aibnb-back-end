import { IUseCase } from "../../../shared/interface";
import { UserCondDTO, UserCreateDTO, UserResponse } from "../model/dto";
import { User } from "../model/model";

export interface IUserUseCase extends IUseCase<UserCreateDTO, UserCondDTO, UserResponse> {
    getByEmail(email: string): Promise<any>
    addFavoriteListing(id: string, userId: string): Promise<any>
    getFavorite(userId: string): Promise<any[] | null>
    removeFavoriteListing(id: string, userId: string): Promise<void>
}

export const USER_MODEL = "user" as const;


