import { Router } from "express"
import { AuthHttpService } from "./infrastructure/transport/http-service"
import { AuthUseCase } from "./usecase"
import passport from "passport"

export const setupAuthModule = () => {
    const usecase = new AuthUseCase()
    const httpService = new AuthHttpService(usecase)

    const router = Router()

    // router.get("/google",
    //     passport.authenticate("google", {scope: ['profile', 'email']})
    // )
    // router.get("/github",
    //     passport.authenticate("github", {scope: ['profile', 'email'], prompt:'select_account'})
    // )
    // router.get("/callback/google",
    //     passport.authenticate('google', { failureRedirect: 'login', session: false}),
    //     httpService.LoginWithGoogle.bind(httpService)
    // )
    // router.get("/github",
    //     passport.authenticate("github", {scope: ['profile', 'email'], prompt:'select_account'}),
    //     httpService.LoginWithGithub.bind(httpService)
    // )
    // router.post("/login", httpService.Login.bind(httpService))
    // router.post("/register", httpService.Register.bind(httpService))
    // router.post("/logout", httpService.Logout.bind(httpService))

    /**
 * @openapi
 * /api/auth/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập với Google (chuyển hướng đến Google OAuth)
 */
router.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));

/**
 * @openapi
 * /api/auth/github:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập với GitHub (chuyển hướng đến GitHub OAuth)
 */
router.get("/github", passport.authenticate("github", { scope: ['profile', 'email'], prompt: 'select_account' }));

/**
 * @openapi
 * /api/auth/callback/google:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Xử lý callback từ Google OAuth
 *     description: |
 *       API xử lý callback từ Google sau khi người dùng đăng nhập bằng Google OAuth. Nếu người dùng là mới, hệ thống sẽ tự động tạo tài khoản.
 *       Hệ thống cũng sẽ tạo accessToken và refreshToken, sau đó gửi về frontend thông qua `window.opener.postMessage` trong một script HTML.
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã xác thực được Google trả về sau khi người dùng đăng nhập thành công
 *     responses:
 *       200:
 *         description: Đăng nhập thành công và phản hồi HTML để gửi user + token về frontend
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: |
 *                 <script>
 *                   window.opener.postMessage({ success: true, user: {id: "...", email: "..."} }, "http://localhost:3000");
 *                   window.close();
 *                 </script>
 *       302:
 *         description: Redirect về trang đăng nhập nếu xác thực thất bại
 *       500:
 *         description: Lỗi server khi xử lý thông tin người dùng từ Google
 */

router.get("/callback/google",
  passport.authenticate('google', { failureRedirect: 'login', session: false }),
  httpService.LoginWithGoogle.bind(httpService)
);

/**
 * @openapi
 * /api/auth/callback/github:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Xử lý callback từ GitHub OAuth
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect sau khi xác thực thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: accessToken và refreshToken được lưu trong cookie
 *       500:
 *         description: Lỗi máy chủ
 */

router.get("/callback/github",
  passport.authenticate("github",{ failureRedirect: "/login", session: false }),
  httpService.LoginWithGithub.bind(httpService)
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng nhập bằng email và mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 name:
 *                   type: string
 *                 image:
 *                   type: string
 *                   format: uri
 *                   nullable: true
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Email hoặc mật khẩu không đúng
 */

router.post("/login", httpService.Login.bind(httpService));

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                 name:
 *                   type: string
 *                 image:
 *                   type: string
 *                   format: uri
 *                   nullable: true
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Email đã tồn tại
 */

router.post("/register", httpService.Register.bind(httpService));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Đăng xuất
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       500:
 *         description: Lỗi server
 */

router.post("/logout", httpService.Logout.bind(httpService));


    return router
}