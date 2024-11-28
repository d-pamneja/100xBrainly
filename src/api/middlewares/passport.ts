import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import { UserModel } from '../../db/model';
import passport from 'passport';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'; 
dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
    },
    async (accessToken : string, refreshToken : string, profile : any, done : any) => {
      try {
          const username = profile.displayName;
          let user = await UserModel.findOne({ username: username });

          if (!user) {
            const hashedPassword = await bcrypt.hash('GOOGLE_PASSWORD',5)
            user = new UserModel({
                username: username,
                password: hashedPassword
            });
            await user.save();
          }
  
          return done(null, user );

        } catch (error) {
          return done(error, null!);
        }
    }
  )
),


passport.use(
  new GithubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || ''
    },
    async (accessToken : string, refreshToken : string, profile : any, done : any) => {
        try {
          const username = profile.username;
          let user = await UserModel.findOne({ username: username });

          if (!user) {
            const hashedPassword = await bcrypt.hash('GITHUB_PASSWORD',5)
            user = new UserModel({
                username: username,
                password: hashedPassword
            });
            await user.save();
          }

          return done(null, user );

        } catch (error) {
          return done(error, null!);
        }
    }
  )
)


  passport.serializeUser((user: any, done) => {
    done(null, user);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  

  
  
