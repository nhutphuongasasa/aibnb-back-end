import { HashAlgorithm, ignoreLogger, VNPay } from "vnpay";

export     const vnpay = new VNPay({
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