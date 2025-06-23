import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv'
import passport from "passport";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { setupUserModule } from './modules/user';
import { setupListingModule } from './modules/listing';
import { errorHandler } from './shared/middleware/exception';
import { setupGithubStrategy, setupGoogleStrategy } from './shared/middleware/strategy';
import { setupAuthModule } from './modules/auth';
import { reservationsUseCase, setupReservationModule } from './modules/reservation';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import fs from 'fs';
import { setupPaymentModule } from './modules/payment';

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

app.use("/api",setupPaymentModule())

app.use("/api/auth",setupAuthModule())

app.use("/api/user",setupUserModule())

app.use("/api/listing",setupListingModule())

app.use("/api/reservation", setupReservationModule())

app.use(errorHandler)

const PORT = 8080

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

fs.writeFileSync('./swagger-output.json', JSON.stringify(swaggerSpec, null, 2));

app.listen(PORT, () =>{
    console.log("oke")
})









