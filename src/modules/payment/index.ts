import { Router } from "express"
import { PaymentHttpService } from "./infrastructure/transport/httpservice"
import { authMiddleware } from "../../shared/middleware/auth"

export const setupPaymentModule= () => {
    const httpService = new PaymentHttpService()

    const router = Router()

    
/**
 * @openapi
 * /api/create-qr:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Tạo link thanh toán VNPay cho đơn đặt phòng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listingId
 *               - startDate
 *               - endDate
 *               - totalPrice
 *             properties:
 *               listingId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               totalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Thành công, trả về URL thanh toán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentUrl:
 *                   type: string
 *                   example: https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...
 *       401:
 *         description: Không có token truy cập hợp lệ
 *       500:
 *         description: Lỗi server
 */
    router.post("/create-qr",authMiddleware, httpService.createVnpay.bind(httpService))

    
/**
 * @openapi
 * /api/vnpay_ipn:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Xử lý callback từ VNPay sau thanh toán
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_Amount
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_ResponseCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_TransactionNo
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_BankCode
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_CardType
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_PayDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: vnp_SecureHash
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả xử lý IPN VNPay
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 RspCode:
 *                   type: string
 *                 Message:
 *                   type: string
 */

    router.get("/vnpay_ipn", httpService.returnVnpay.bind(httpService))

    return router
}