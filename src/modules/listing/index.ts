import { Router } from "express"
import { ListingRepository } from "./infrastructure/repository"
import { ListingHttpService } from "./infrastructure/transport/http-service"
import { ListingUseCase } from "./usecase"

export const  setupListingModule = () => {
    const repository = new ListingRepository()
    const usecase = new ListingUseCase(repository)
    const httpService = new ListingHttpService(usecase)

    const router = Router()

    router.get("/me", httpService.getListMe.bind(httpService))
    router.get("/:id", httpService.getDetail.bind(httpService))
    router.post("/", httpService.create.bind(httpService))
    router.get("/", httpService.getList.bind(httpService))
    router.delete("/:id", httpService.deleteListing.bind(httpService))

    return router
}

export const listingUseCase = (): ListingUseCase => {
    const repository = new ListingRepository()
    return new ListingUseCase(repository)
}