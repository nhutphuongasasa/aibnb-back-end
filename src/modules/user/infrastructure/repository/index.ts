import { BaseCommandRepository, BaseQueryRepository, BaseRepository } from "../../../../shared/repository/repo-prisma";
import { UserCondDTO } from "../../model/dto";
import { User } from "../../model/model";
import { USER_MODEL } from "../../interface";
import prisma from "../../../../shared/lib/prismaDB";

export class UserRepository extends BaseRepository<User, UserCondDTO>{
    constructor(
    ){
        super(
            new UserQueryRepository(),
            new UserCommandRepository()
        )
    }
}

export class UserQueryRepository extends BaseQueryRepository<User, UserCondDTO>{
    constructor(){
        super(USER_MODEL)
    }

    // async getByEmail(email: string){
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             email: email
    //         }
    //     })

    //     if(!user){
    //         return null
    //     }

    //     return user
    // }
}

export class UserCommandRepository extends BaseCommandRepository<User>{
    constructor(){
        super(USER_MODEL)
    }
}