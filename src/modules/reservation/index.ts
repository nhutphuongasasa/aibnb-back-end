import { Router } from "express"
import { listingUseCase } from "../listing/index"
import { userUseCase } from "../user/index"
import { ReservationRepository } from "./infrastructure/repository"
import { ReservationHttpService } from "./infrastructure/transport/http-service"
import { ReservationUseCase } from "./usecase"
import { authMiddleware } from "../../shared/middleware/auth"

export const setupReservationModule = () => {
    const repository = new ReservationRepository() 
    const usecase = new ReservationUseCase(listingUseCase(), userUseCase(), repository)
    const httpService = new ReservationHttpService(usecase)

    const router = Router()

    // router.get("/", httpService.getList.bind(httpService))
    // router.get("/:id", httpService.getDetail.bind(httpService))
    // router.post("/", httpService.create.bind(httpService))
    // router.delete("/:id", httpService.delete.bind(httpService))
    
/**
 * @openapi
 * /api/reservations:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Lấy danh sách các đặt phòng
 *     responses:
 *       200:
 *         description: Danh sách các đặt phòng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   listingId:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   totalPrice:
 *                     type: number
 *                   createAt:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   listing:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       imageSrc:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                       category:
 *                         type: string
 *                       roomCount:
 *                         type: integer
 *                       bathroomCount:
 *                         type: integer
 *                       guestCount:
 *                         type: integer
 *                       locationValue:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       price:
 *                         type: number
 *       404:
 *         description: Không tìm thấy dữ liệu
 */

router.get("/",authMiddleware, httpService.getList.bind(httpService));

/**
 * @openapi
 * /api/reservation/{id}:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Lấy chi tiết một reservation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của reservation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết reservation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 listingId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 totalPrice:
 *                   type: number
 *                 createAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 listing:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     imageSrc:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                     category:
 *                       type: string
 *                     roomCount:
 *                       type: integer
 *                     bathroomCount:
 *                       type: integer
 *                     guestCount:
 *                       type: integer
 *                     locationValue:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     price:
 *                       type: number
 *       404:
 *         description: Không tìm thấy reservation
 */

router.get("/:id", httpService.getDetail.bind(httpService));

/**
 * @openapi
 * /api/reservation:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Tạo mới một reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - listingId
 *               - startDate
 *               - endDate
 *               - totalPrice
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng
 *               listingId:
 *                 type: string
 *                 description: ID của listing
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Reservation được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy user hoặc listing
 */

router.post("/",authMiddleware, httpService.create.bind(httpService));

/**
 * @openapi
 * /api/reservation/{id}:
 *   delete:
 *     tags:
 *       - Reservations
 *     summary: Xoá reservation theo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của reservation cần xoá
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá reservation thành công
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: successful
 *       400:
 *         description: Người dùng không hợp lệ hoặc không có quyền xoá
 *       404:
 *         description: Không tìm thấy reservation hoặc user
 */

router.delete("/:id", httpService.delete.bind(httpService));


    return router
}

export const reservationsUseCase = () => {
    const repository = new ReservationRepository() 
    const usecase = new ReservationUseCase(listingUseCase(), userUseCase(), repository)

    return usecase
}