import { Router } from "express"
import { ListingRepository } from "./infrastructure/repository"
import { ListingHttpService } from "./infrastructure/transport/http-service"
import { ListingUseCase } from "./usecase"

export const  setupListingModule = () => {
    const repository = new ListingRepository()
    const usecase = new ListingUseCase(repository)
    const httpService = new ListingHttpService(usecase)

    const router = Router()

    // router.get("/me", httpService.getListMe.bind(httpService))
    // router.get("/:id", httpService.getDetail.bind(httpService))
    // router.post("/", httpService.create.bind(httpService))
    // router.get("/", httpService.getList.bind(httpService))
    // router.delete("/:id", httpService.deleteListing.bind(httpService))

/**
 * @openapi
 * /api/listing/me:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Lấy danh sách listing của chính người dùng (current user)
 *     responses:
 *       200:
 *         description: Danh sách listing của người dùng hiện tại
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
 *                       format: uri
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
 *                     type: number
 *       401:
 *         description: Chưa xác thực người dùng
 */

router.get("/me", httpService.getListMe.bind(httpService));

/**
 * @openapi
 * /api/listing/{id}:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Lấy chi tiết một listing theo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của listing cần lấy
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của listing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imageSrc:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                 category:
 *                   type: string
 *                 roomCount:
 *                   type: integer
 *                 bathroomCount:
 *                   type: integer
 *                 guestCount:
 *                   type: integer
 *                 locationValue:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 price:
 *                   type: number
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *       404:
 *         description: Không tìm thấy listing
 */

router.get("/:id", httpService.getDetail.bind(httpService));

/**
 * @openapi
 * /api/listing:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Tạo một listing mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - roomCount
 *               - bathroomCount
 *               - guestCount
 *               - location
 *               - price
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Biệt thự sang trọng Đà Lạt"
 *               description:
 *                 type: string
 *                 example: "View đồi thông, đầy đủ tiện nghi"
 *               imageSrc:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com/image1.jpg"]
 *               category:
 *                 type: string
 *                 example: "Villa"
 *               roomCount:
 *                 type: integer
 *                 example: 3
 *               bathroomCount:
 *                 type: integer
 *                 example: 2
 *               guestCount:
 *                 type: integer
 *                 example: 6
 *               location:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *                     example: "VN-63"
 *                   label:
 *                     type: string
 *                     example: "Lâm Đồng"
 *                   flag:
 *                     type: string
 *                     example: "🇻🇳"
 *                   latlng:
 *                     type: array
 *                     items:
 *                       type: number
 *                     example: [11.9404, 108.4583]
 *                   region:
 *                     type: string
 *                     example: "Tây Nguyên"
 *               price:
 *                 type: number
 *                 example: 120
 *               userId:
 *                 type: string
 *                 example: "64f2bcbcb20bd28a64a3c123"
 *     responses:
 *       201:
 *         description: Listing đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 imageSrc:
 *                   type: array
 *                   items:
 *                     type: string
 *                 category:
 *                   type: string
 *                 roomCount:
 *                   type: integer
 *                 bathroomCount:
 *                   type: integer
 *                 guestCount:
 *                   type: integer
 *                 locationValue:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 price:
 *                   type: number
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *       404:
 *         description: Không tìm thấy người dùng
 */

router.post("/", httpService.create.bind(httpService));

/**
 * @openapi
 * /api/listing:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Lấy danh sách tất cả listing theo điều kiện lọc
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: ID của người dùng (người tạo listing)
 *       - name: category
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Danh mục của listing
 *       - name: roomCount
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Số phòng ngủ tối thiểu
 *       - name: bathroomCount
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Số phòng tắm tối thiểu
 *       - name: guestCount
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         description: Số lượng khách tối thiểu
 *       - name: localVale
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Địa điểm cụ thể
 *       - name: price
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *         description: Mức giá tối thiểu
 *       - name: startDate
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu dự kiến thuê
 *       - name: endDate
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc dự kiến thuê
 *     responses:
 *       200:
 *         description: Danh sách listing phù hợp
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
 *                     type: number
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                         format: email
 */

router.get("/", httpService.getList.bind(httpService));

/**
 * @openapi
 * /api/listing/{id}:
 *   delete:
 *     tags:
 *       - Listings
 *     summary: Xoá một listing theo ID
 *     description: Xoá một listing thuộc quyền sở hữu của người dùng hiện tại
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của listing cần xoá
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách listing mới của người dùng sau khi xoá
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
 *                     type: number
 *       404:
 *         description: Không tìm thấy listing hoặc không thuộc quyền sở hữu người dùng
 */

router.delete("/:id", httpService.deleteListing.bind(httpService));


    return router
}

export const listingUseCase = (): ListingUseCase => {
    const repository = new ListingRepository()
    return new ListingUseCase(repository)
}