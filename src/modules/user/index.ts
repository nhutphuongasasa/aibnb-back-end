import { Router } from "express"
import { UserRepository } from "./infrastructure/repository"
import { UserHttpService } from "./infrastructure/transport/http-service"
import { UserUseCase } from "./usecase"
import { listingUseCase } from "../listing/index"


export const setupUserModule = () => {
    const repository = new UserRepository()
    const usecase = new UserUseCase(repository, listingUseCase())
    const httpService = new UserHttpService(usecase)

    const router = Router()
    router.get("/profile", httpService.getDetail.bind(httpService))
    router.post("/", httpService.create.bind(httpService))
    router.post("/favorites/:id", httpService.addFavoriteListing.bind(httpService))
    router.delete("/favorites/:id", httpService.removeDavoriteListing.bind(httpService))
    router.get("/favorites", httpService.getFavoriteListing.bind(httpService))
    return router
}

export const userUseCase = (): UserUseCase => {
    const repository = new UserRepository()

    return new UserUseCase(repository, listingUseCase())
}