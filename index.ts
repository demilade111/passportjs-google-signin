require("dotenv").config();
const express = require("express");
const { createConnection } = require("typeorm");
const typeormConfig = require("./config/typeorm.config");
import passport from "passport";

const app = express();

createConnection(typeormConfig)
  .then(() => {
    app.use(passport.initialize());

    app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      (req, res) => {
        // Successful authentication, redirect home.
        res.redirect("/");
      }
    );

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log("TypeORM connection error: ", error));
