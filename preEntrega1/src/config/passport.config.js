import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import { userModel } from "../dao/models/users.model.js";
import { cartsModel } from "../dao/models/carts.model.js";
const LocalStrategy = local.Strategy;
import GitHubStrategy from "passport-github2";
import fetch from "node-fetch";

export function initializePassport() {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          if (!isValidPassword(password, user.password)) {
            return done(null, false, { message: "Wrong password" });
          }
          user.last_connection = Date.now();
          await user.save();

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body;
          let user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false, { message: "User already exists" });
          }

          const cart = await cartsModel.create({});

          const newUser = {
            email,
            firstName,
            lastName,
            age,
            password: createHash(password),
            cart: cart._id,
          };

          let userCreated = await userModel.create(newUser);
          return done(null, userCreated, { message: "User created" });
        } catch (error) {
          return done(error, { message: "Error creating user" });
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.14074c462b8bdb46",
        clientSecret: "7d797a064cf60bece68109779e7d6239696bd817",
        callbackURL: 
          "https://backendcarranzacoderhouse.onrender.com/api/sessions/githubcallback",
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: "Bearer " + accesToken,
              "X-Github-Api-Version": "2022-11-28",
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error("cannot get a valid email for this user"));
          }
          profile.email = emailDetail.email;

          let user = await userModel.findOne({ email: profile.email });
          if (!user) {
            const cart = await cartsModel.create({});
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || "noname",
              lastName: "externalAuth",
              password: createHash("nopass"),
              cart: cart._id,
            };
            let userCreated = await userModel.create(newUser);

            return done(null, userCreated);
          } else {
            user.last_connection = Date.now();
            await user.save();

            return done(null, user);
          }
        } catch (e) {
          return done(e);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  let user = await userModel.findById(id);
  done(null, user);
});

