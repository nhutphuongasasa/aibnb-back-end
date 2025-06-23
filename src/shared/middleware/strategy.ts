import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from '../lib/prismaDB';
import {Strategy as GithubStrategy} from 'passport-github'

export const setupGoogleStrategy = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID! as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
        callbackURL: `${process.env.SERVER_URL}/api/auth/callback/google`
    },async(accessToken, refreshToken, profile, cb) => {
        const userExisting = await prisma.user.findUnique({
            where: {
                email: profile.emails?.[0].value
            }
        })
    
        if (!userExisting){
            const user = await prisma.user.create({
                data:{
                    email: profile.emails?.[0].value,
                    name: profile.displayName,
                    emailVerified: null,
                    image: profile.photos?.[0].value,
                }
            })
            return cb(null, {
                ...user,
                createdAt: user.createdAt?.toISOString(),
                updatedAt: user.updatedAt?.toISOString(),
                emailVerified: user.emailVerified?.toISOString() || null
            })
        }
    
        return cb(null, {
            ...userExisting,
            createdAt: userExisting.createdAt?.toISOString(),
            updatedAt: userExisting.updatedAt?.toISOString(),
            emailVerified: userExisting.emailVerified?.toISOString() || null
        })
    }))
}

export const setupGithubStrategy = () => {
    passport.use(new GithubStrategy({
      clientID: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/api/auth/callback/github`
    }, async (accessToken, refreshToken, profile, cb) => {
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`; // fallback email
      const name = profile.displayName || profile.username;
      const image = profile.photos?.[0]?.value;
  
      let user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            image,
            emailVerified: null,
          }
        });
      }
  
      return cb(null, {
        ...user,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
        emailVerified: user.emailVerified?.toISOString() || null,
      });
    }));
  };
