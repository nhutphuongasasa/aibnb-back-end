import { NextFunction, Request, Response } from "express";
import { IUseCase } from "../interface";
// import { UserCondDTO } from "../../modules/user/model/dto";
import { AppError } from "../model/error";
import jwt, { JwtPayload } from 'jsonwebtoken'

export abstract class BaseHttpService<CreateDTO, CondDTO, ResponseDTO>{
    constructor(readonly usecase: IUseCase<CreateDTO, CondDTO, ResponseDTO>){}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // console.log(req.body)
            const accessToken = req.cookies.accessToken

            if(accessToken){
                console.log("co")
                const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload

                req.body.userId = user.id
            }
            console.log(req.body)

            const result = await this.usecase.create(req.body);
            res.status(201).json({ data: result});
        } catch (error) {
            next(error)
        }
    }

    async getDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            const result = await this.usecase.getDetail(id);
            if (!result) {
                // throw new Error("Entity Not found");
                throw new AppError(404,'Entity not found')
            }
            res.status(200).json({ data: result })
        } catch (error) {
            next(error)
        }
    }

    // async getList(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     try {
    //         const { success, error } = UserCondDTO.safeParse(req.query)
    //         if (!success) {
    //             res.status(400).json({
    //                 message: error.message,
    //             });
    //             return;
    //         }
    //         const result = await this.usecase.getList(req.query as CondDTO);

    //         res.status(200).json({ data: result })
    //     } catch (error) {
    //         next(error)
    //     }
    // }

}



// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID! as string,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
//     callbackURL: `/api/auth/callback/google`
// },async(accessToken, refreshToken, profile, cb) => {
//     const userExisting = await prisma.user.findUnique({
//         where: {
//             email: profile.emails?.[0].value
//         }
//     })

//     if (!userExisting){
//         const user = await prisma.user.create({
//             data:{
//                 email: profile.emails?.[0].value,
//                 name: profile.displayName,
//                 emailVerified: null,
//                 image: profile.photos?.[0].value,
//             }
//         })
//         return cb(null, {
//             ...user,
//             createdAt: user.createdAt?.toISOString(),
//             updatedAt: user.updatedAt?.toISOString(),
//             emailVerified: user.emailVerified?.toISOString() || null
//         })
//     }

//     return cb(null, {
//         ...userExisting,
//         createdAt: userExisting.createdAt?.toISOString(),
//         updatedAt: userExisting.updatedAt?.toISOString(),
//         emailVerified: userExisting.emailVerified?.toISOString() || null
//     })
// }))

// passport.use(new GithubStrategy({
//     clientID: process.env.GITHUB_ID! as string,
//     clientSecret: process.env.GITHUB_SECRET! as string,
//     callbackURL: `/api/auth/callback/github`
//   }, (accessToken, refreshToken, profile, done) => {
//     // Xử lý user profile
//     done(null, profile);
// }));


// app.get("/auth/google",
//     passport.authenticate("google", {scope: ['profile', 'email']})
// )

// app.get("/api/auth/callback/google", passport.authenticate('google', { failureRedirect: 'login', session: false}),
//     function(req,res){
//         const user = req.user as any

//         const accessToken = generateAccessToken(user)

//         const refreshToken = generateRefreshToken(user)

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: true,
//             maxAge: 7 * 24 * 60 * 60 * 1000
//         })

//         res.cookie('accessToken', accessToken, {
//             httpOnly: true,
//             secure: true,
//             maxAge: 15 * 60 * 1000
//         })

//         res.send(`
//             <script>
//               window.opener.postMessage({ success: true, user: ${JSON.stringify(user)} }, "http://localhost:3000");
//               window.close();
//             </script>
//         `);
//     }
// )

// app.get("/auth/github",
//     passport.authenticate("github", {scope: ['profile', 'email'], prompt:'select_account'})
// )

// app.get("/api/auth/callback/github", passport.authenticate('github', { failureRedirect: 'login', session: false}),
//     function(req,res){
//         const user = req.user as any

//     // Tạo JWT
//     const token = jwt.sign(
//       {
//         id: user.id,
//         displayName: user.displayName,
//         email: user.email
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: '1h' }
//     )


//     res.redirect(process.env.CLIENT_URL! as string);
//     }
// )

// app.get('/api/auth/profile', async (req: Request, res: Response): Promise<any> => {
//     console.log(req.cookies.refreshToken)
//     const accessToken = req.cookies.accessToken;
//     const refreshToken = req.cookies.refreshToken;

//     if (!accessToken && !refreshToken) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     if (!accessToken) {
//         const accessToken = generateAccessTokenFromRefreshToken(refreshToken);
//         if(!accessToken) { 
//             return res.status(401).json({ error: 'Unauthorized' });
//         }
//         res.cookie('accessToken', accessToken, {
//             httpOnly: true,
//             secure: true,
//             maxAge: 15 * 60 * 1000 // 15 minutes
//         });
//     }

//     const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as any
    
//     const email = decode.email as string
//     // console.log("Decoded email:", email);

//     const user = await prisma.user.findUnique({
//         where: {
//             email: email
//             // email: 'phuongbt3232@gmail.com'
//         }
//     })

//     console.log("User profile fetched:", user);

//     res.json({
//         user
//     })
// })

// app.post('/api/auth/login', async (req: Request, res: Response): Promise<any> => {
//     const user = await prisma.user.findUnique({
//         where: {
//             email: req.body.email
//         }
//     })
    
//     const accessToken = generateAccessToken(user)

//     const refreshToken = generateRefreshToken(user)

//     res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         // secure: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000
//     })

//     res.cookie('accessToken', accessToken, {
//         httpOnly: true,
//         // secure: true,
//         maxAge: 15 * 60 * 1000
//     })
//     res.status(200).json({
//         message: 'Login successful',
//         user: {
//             ...user,
//         }
//     });
// })

// app.post('/api/auth/logout', (req: Request, res: Response) => {
//     // console.log("Logging out user...");
//     res.clearCookie('refreshToken', {
//         httpOnly: true,
//         secure: true,
//     });
//     res.clearCookie('accessToken', {
//         httpOnly: true,
//         secure: true,
//     });
//     console.log("User logged out successfully");
//     res.status(200).json({ message: 'Logged out successfully' });
// })
