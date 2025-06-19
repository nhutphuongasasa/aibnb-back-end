import { Router } from "express"
import { AuthHttpService } from "./infrastructure/transport/http-service"
import { AuthUseCase } from "./usecase"
import passport from "passport"

export const setupAuthModule = () => {
    const usecase = new AuthUseCase()
    const httpService = new AuthHttpService(usecase)

    const router = Router()

    router.get("/google",
        passport.authenticate("google", {scope: ['profile', 'email']})
    )
    router.get("/github",
        passport.authenticate("github", {scope: ['profile', 'email'], prompt:'select_account'})
    )
    router.get("/callback/google",
        passport.authenticate('google', { failureRedirect: 'login', session: false}),
        httpService.LoginWithGoogle.bind(httpService)
    )
    router.get("/github",
        passport.authenticate("github", {scope: ['profile', 'email'], prompt:'select_account'}),
        httpService.LoginWithGithub.bind(httpService)
    )
    router.post("/login", httpService.Login.bind(httpService))
    router.post("/register", httpService.Register.bind(httpService))
    router.post("/logout", httpService.Logout.bind(httpService))

    return router
}