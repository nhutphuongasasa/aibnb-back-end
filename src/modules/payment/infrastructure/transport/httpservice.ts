import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, VerifyIpnCall, HashAlgorithm, consoleLogger, IpnSuccess, VerifyReturnUrl, IpnFailChecksum, IpnUnknownError, IpnOrderNotFound, IpnInvalidAmount, InpOrderAlreadyConfirmed, ReturnQueryFromVNPay } from 'vnpay';
import prisma from '../../../../shared/lib/prismaDB';
import { vnpay } from '../../../../shared/lib/vnpay';
import { reservationsUseCase } from '../../../reservation';


export class PaymentHttpService {

    


async createVnpay (req: Request, res: Response, next: NextFunction): Promise<any>{
    const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
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
      vnp_ReturnUrl: 'http://localhost:3000', 
      vnp_Locale: VnpLocale.VN,
  });

  // return res.redirect(paymentUrl);
  return res.json({paymentUrl})
};

    
    async returnVnpay (req: Request, res: Response): Promise<any>{
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
    };
}