import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv'
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from 'cors'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {Strategy as GithubStrategy} from 'passport-github'
import prisma from './shared/lib/prismaDB';
import cookieParser from 'cookie-parser';
import { generateAccessToken, generateAccessTokenFromRefreshToken, generateRefreshToken } from './shared/lib/genToken';
import { setupUserModule } from './modules/user';
import { setupListingModule } from './modules/listing';
import { errorHandler } from './shared/middleware/exception';
import { setupGithubStrategy, setupGoogleStrategy } from './shared/middleware/strategy';
import { setupAuthModule } from './modules/auth';
import { reservationsUseCase, setupReservationModule } from './modules/reservation';
import crypto from "crypto";
import qs from "qs";
import config from 'config';
import { IncomingHttpHeaders } from 'http';
import moment from 'moment'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, VerifyIpnCall, HashAlgorithm, consoleLogger, IpnSuccess, VerifyReturnUrl, IpnFailChecksum, IpnUnknownError, IpnOrderNotFound, IpnInvalidAmount, InpOrderAlreadyConfirmed, ReturnQueryFromVNPay } from 'vnpay';
import { promises } from 'dns';
// import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()

app.use(cors({
    // origin: process.env.CLIENT_URL,
    origin: true, // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(cookieParser())

app.use(express.json())


setupGithubStrategy()
setupGoogleStrategy()

app.use(passport.initialize())


const vnpay = new VNPay({
  tmnCode: 'GQMN02JF',
  secureSecret: 'VZNYNF7L6KC6PKKQX3TOF98GAQ3PJHAC',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', 

  testMode: true, 
  hashAlgorithm: HashAlgorithm.SHA512,


  enableLog: true, // tùy chọn

  loggerFn: ignoreLogger, // tùy chọn

  endpoints: {
      paymentEndpoint: 'paymentv2/vpcpay.html',
      queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
      getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  }, // tùy chọn
});


const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);


app.post('/api/create-qr', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  // console.log("oke")

  const accessToken = req.cookies.accessToken

  const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

  const userId =user.id

  const { listingId, startDate, endDate, totalPrice } = req.body

  const useCase = reservationsUseCase()
  const reservation = await useCase.create({
    userId, listingId, startDate, endDate, totalPrice
  })

  // Tạo URL thanh toán
  const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: totalPrice*25000,
      vnp_IpAddr:
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        '127.0.0.1',
      vnp_TxnRef: reservation.id,
      vnp_OrderInfo: `Thanh toan don hang `,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.CLIENT_URL, 
      vnp_Locale: VnpLocale.VN,
  });

  // return res.redirect(paymentUrl);
  return res.json({paymentUrl})
});

app.get('/api/vnpay_ipn', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("return")
      const quey = req.query as ReturnQueryFromVNPay
      const verify: VerifyReturnUrl = vnpay.verifyIpnCall(quey);

      if (!verify.isVerified) {
          return res.json(IpnFailChecksum);
      }

      if (!verify.isSuccess) {
          return res.json(IpnUnknownError);
      }

      const useCase = reservationsUseCase()

      const foundOrder = await prisma.reservation.findUnique({
        where: {
          id: verify.vnp_TxnRef
        }
      }); 

      console.log(foundOrder)

      if (!foundOrder || verify.vnp_TxnRef !== foundOrder.id) {
          return res.json(IpnOrderNotFound);
      }

      if (foundOrder.status === 'CONFIRMED') {
          return res.json(InpOrderAlreadyConfirmed);
      }

      await prisma.reservation.update({
        where: {
          id: foundOrder.id
        },
        data: {
          status: 'CONFIRMED'
        }
      });
      console.log("payment")

      const payment = await prisma.payment.create({
        data: {
          userId: foundOrder.userId,
          ReservationId: foundOrder.id, // vnp_TxnRef
          amount: foundOrder.totalPrice, // VND
          orderInfo: "Thanh toan don hang", // vnp_OrderInfo
          bankCode: quey.vnp_BankCode!, // vnp_BankCode
          payDate: quey.vnp_PayDate?.toString() ?? '', // vnp_PayDate (format yyyyMMddHHmmss)
          transactionNo: quey.vnp_TransactionNo?.toString() ?? '', // vnp_TransactionNo (unique)
          cardType: quey.vnp_CardType!, // vnp_CardType
          status: verify.isSuccess ? "SUCCESS" : "FAILED", // hoặc "FAILED"
        },
      });

      console.log(payment)
      
      return res.json(IpnSuccess);
    
    } catch (error) {
      console.log(`verify error: ${error}`);
      return res.json(IpnUnknownError);
  }
});






// function sortObject(obj: Record<string, string>) {
//     const sorted = Object.keys(obj).sort().reduce((result: any, key) => {
//       result[key] = obj[key];
//       return result;
//     }, {});
//     return sorted;
//   }

//   app.post('/api/create-qr', async (req: Request, res: Response): Promise<any> => {
//     try {
//       // Đặt múi giờ
//       process.env.TZ = 'Asia/Ho_Chi_Minh';
  
//       // Kiểm tra biến môi trường
//       const tmnCode = process.env.VNP_TMNCODE;
//       const secureSecret = process.env.VNP_HASHSECRET;
//       if (!tmnCode || !secureSecret) {
//         return res.status(500).json({ error: 'Cấu hình VNPay không hợp lệ' });
//       }
  
//       // Khởi tạo VNPay
//       const vnpay = new VNPay({
//         tmnCode: tmnCode,
//         secureSecret: secureSecret,
//         vnpayHost: 'https://sandbox.vnpayment.vn',
//         testMode: true,
//         loggerFn: ignoreLogger,
//       });
  
//       // Lấy amount từ body hoặc mặc định
//       const amount = req.body.amount ? Number(req.body.amount) * 100 : 50000 * 100; // Sửa lỗi đơn vị
//       const txnRef = Date.now().toString(); // Mã giao dịch duy nhất
//       const now = new Date();
  
//       // Xây dựng URL thanh toán
//       let vnpayResponse = await vnpay.buildPaymentUrl({
//         vnp_Amount: amount,
//         vnp_IpAddr: req.ip || '127.0.0.1',
//         vnp_TxnRef: txnRef,
//         vnp_OrderInfo: `Thanh toán đơn hàng ${txnRef}`,
//         vnp_ExpireDate: dateFormat(new Date(now.getTime() + 15 * 60 * 1000)),
//         vnp_OrderType: ProductCode.Other,
//         vnp_ReturnUrl: 'http://localhost:3000/api/vnpay_return', // Sửa cổng, 
//         vnp_Locale: VnpLocale.VN,
//         vnp_CreateDate: dateFormat(now),
//       });
      
//       const finalUrl = vnpayResponse ;
  
//       // Trả về JSON chứa URL thanh toán
//       return res.status(200).json({ paymentUrl: vnpayResponse  });
//     } catch (error) {
//       console.error('Lỗi tạo URL thanh toán:', error);
//       return res.status(500).json({ error: 'Không thể tạo URL thanh toán' });
//     }
//   });

// app.get('/api/vnpay_ipn', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     // try {
//     //   const vnp_Params = { ...req.query } as Record<string, string>;
//     //   const secureHash = vnp_Params['vnp_SecureHash'];
  
//     //   // Bỏ các trường không cần thiết để verify
//     //   delete vnp_Params['vnp_SecureHash'];
//     //   delete vnp_Params['vnp_SecureHashType'];
  
//     //   const sortedParams = sortObject(vnp_Params);
//     //   const signData = qs.stringify(sortedParams, { encode: false });
  
//     //   const signed = crypto
//     //     .createHmac('sha512', process.env.VNP_HASHSECRET!)
//     //     .update(Buffer.from(signData, 'utf-8'))
//     //     .digest('hex');
  
//     //   // So sánh chữ ký
//     //   if (secureHash !== signed) {
//     //     return res.status(400).json({ RspCode: '97', Message: 'Checksum sai' });
//     //   }
  
//     //   // Kiểm tra mã phản hồi từ VNPay
//     //   const success = vnp_Params['vnp_ResponseCode'] === '00';
  
//     //   const dataToSave = {
//     //     userId: "",
//     //     orderId: vnp_Params['vnp_TxnRef'],
//     //     amount: parseFloat(vnp_Params['vnp_Amount']) / 100,
//     //     orderInfo: vnp_Params['vnp_OrderInfo'],
//     //     bankCode: vnp_Params['vnp_BankCode'],
//     //     payDate: vnp_Params['vnp_PayDate'],
//     //     transactionNo: vnp_Params['vnp_TransactionNo'],
//     //     cardType: vnp_Params['vnp_CardType'],
//     //     status: success ? 'SUCCESS' : 'FAILED',
//     //   };
  
//     //   // Kiểm tra đã tồn tại chưa để tránh trùng
//     //   const existing = await prisma.payment.findUnique({
//     //     where: { transactionNo: dataToSave.transactionNo },
//     //   });
  
//     //   if (!existing) {
//     //     await prisma.payment.create({ data: dataToSave });
//     //   }
  
//     //   //  res.status(200).json({ RspCode: '00', Message: 'Success' });
      
//     // } catch (error) {
//     //   console.error('VNPay IPN error:', error);
//     //    res.status(500).json({ RspCode: '99', Message: 'Lỗi hệ thống' });
//     // }
//     console.log("okelllllllllllllllllll")
//   });




app.use("/api/auth",setupAuthModule())

app.use("/api/user",setupUserModule())

app.use("/api/listing",setupListingModule())

app.use("/api/reservation", setupReservationModule())

app.use(errorHandler)

const PORT = 8080

app.listen(PORT, () =>{
    console.log("oke")
})









