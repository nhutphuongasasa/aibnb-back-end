import { IRepository } from "../../../shared/interface";
import prisma from "../../../shared/lib/prismaDB";
import { AppError } from "../../../shared/model/error";
import { IListingUseCase } from "../../listing/interface";
import { IUserUseCase } from "../interface";
import { UserCondDTO, UserCreateDTO, UserResponse, UserResponseSchema } from "../model/dto";
import { User, UserSchema } from "../model/model"
import bcrypt from "bcrypt"

export class UserUseCase implements IUserUseCase {
    constructor(
        private readonly repository: IRepository<User, UserCondDTO>,
        private readonly listingUseCase: IListingUseCase,
    ) {}

    async removeFavoriteListing(id: string, userId: string): Promise<any> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        const newFavorites = user?.favoriteIds.filter((favorite) => favorite !== id)

        await prisma.user.update({
            where: {
                id: userId
            }, data: {
                favoriteIds: newFavorites
            }
        })

        const newUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        console.log(newUser)

        return newUser
    }

    async addFavoriteListing(id: string, userId: string): Promise<any> {
        const user = await this.repository.GetById(userId)
        
        if(!userId){
            throw new AppError(404, "User not found")
        }
        
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                favoriteIds: {
                    push: id
                }
            }
        })
        const newUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return newUser
    }

    async getFavorite(userId: string): Promise<any[] | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        const listings = await prisma.listing.findMany({
            where: {
                id: {
                    in: user?.favoriteIds
                }
            }
        })
    
        return listings;
    }

    async getByEmail(email: string): Promise<any> {
        const userExisting = await this.repository.FindOneByCond({
            email: email
        })

        if(!userExisting){
            throw new AppError(404, "User not Found")
        }
        
        return UserResponseSchema.parse(userExisting)
        return userExisting
    }
    
    async create(data: UserCreateDTO): Promise<UserResponse> {
        const user = UserSchema.parse(data)

        const userExisting = await this.repository.FindOneByCond({ email: user.email})

        if(userExisting){
            throw new AppError(409, "Email already exists")
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const newUser: User = {
            ...user,
            hashedPassword: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const createdUser = await this.repository.Create(newUser);

        if (!createdUser) {
            throw new Error("Failed to create user");
        }

        return UserResponseSchema.parse(createdUser)
    }

    async getDetail(id: string): Promise< UserResponse | null> {
        // const user = await this.repository.GetById(id);\

        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            throw new AppError(404, "User not found")
        }

        console.log("get detail")
        console.log(user)
        return UserResponseSchema.parseAsync(user);
    }

    async getList(cond: UserCondDTO): Promise< UserResponse[] | null>{
        const users = await this.repository.FindListByCond(cond)

        if (!users || users.length === 0) {
            return Promise.resolve(null);
        }

        return users.map( user => UserResponseSchema.parse(user) );
    }
}