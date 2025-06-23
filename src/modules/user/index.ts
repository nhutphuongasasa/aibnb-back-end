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
    // router.get("/profile", httpService.getDetail.bind(httpService))
    // router.post("/", httpService.create.bind(httpService))
    // router.post("/favorites/:id", httpService.addFavoriteListing.bind(httpService))
    // router.delete("/favorites/:id", httpService.removeDavoriteListing.bind(httpService))
    // router.get("/favorites", httpService.getFavoriteListing.bind(httpService))

    /**
 * @openapi
 * /api/user/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy thông tin hồ sơ người dùng
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "example@gmail.com"
 *                 image:
 *                   type: string
 *                   format: uri
 *                   nullable: true
 *                   example: "https://example.com/avatar.jpg"
 *                 favoriteIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["abc123", "def456"]
 *       401:
 *         description: Chưa xác thực hoặc không có token
 */
  router.get("/profile", httpService.getDetail.bind(httpService));

/**
 * @openapi
 * /api/user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Tạo người dùng mới
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
 *                 example: "Nguyễn Văn A"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "example@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "abc123456"
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "example@gmail.com"
 *                 image:
 *                   type: string
 *                   format: uri
 *                   nullable: true
 *                   example: "https://example.com/avatar.jpg"
 *                 favoriteIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["abc123", "def456"]
 *       409:
 *         description: Email đã tồn tại
 */

  router.post("/", httpService.create.bind(httpService));

/**
 * @openapi
 * /api/user/favorites/{id}:
 *   post:
 *     tags:
 *       - Users
 *     summary: Thêm listing vào danh sách yêu thích
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của listing cần thêm
 *     responses:
 *       200:
 *         description: Thêm thành công, trả về thông tin người dùng đã cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "example@gmail.com"
 *                 name:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 image:
 *                   type: string
 *                   format: uri
 *                   nullable: true
 *                 favoriteIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["listing1", "listing2"]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Không tìm thấy người dùng
 */

  router.post("/favorites/:id", httpService.addFavoriteListing.bind(httpService));

/**
 * @openapi
 * /api/user/favorites/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Xoá một listing khỏi danh sách yêu thích
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của listing cần xoá khỏi favorites
 *     responses:
 *       200:
 *         description: Xoá thành công, trả về người dùng đã cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "example@gmail.com"
 *                 name:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 image:
 *                   type: string
 *                   format: uri
 *                   nullable: true
 *                 favoriteIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["listing1", "listing3"]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Không tìm thấy người dùng hoặc dữ liệu không hợp lệ
 */

  router.delete("/favorites/:id", httpService.removeDavoriteListing.bind(httpService));

/**
 * @openapi
 * /api/user/favorites:
 *   get:
 *     tags:
 *       - Users
 *     summary: Lấy danh sách các listing yêu thích của người dùng
 *     responses:
 *       200:
 *         description: Danh sách listing đã yêu thích
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   imageSrc:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                   createAt:
 *                     type: string
 *                     format: date-time
 *                   category:
 *                     type: string
 *                   roomCount:
 *                     type: integer
 *                   bathroomCount:
 *                     type: integer
 *                   guestCount:
 *                     type: integer
 *                   locationValue:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   price:
 *                     type: integer
 *       404:
 *         description: Không tìm thấy người dùng hoặc dữ liệu không hợp lệ
 */

  router.get("/favorites", httpService.getFavoriteListing.bind(httpService));


    return router
}

export const userUseCase = (): UserUseCase => {
    const repository = new UserRepository()

    return new UserUseCase(repository, listingUseCase())
}