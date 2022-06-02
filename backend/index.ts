import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import passport from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import User from "./src/User";
import path from "path";
import bodyParser from "body-parser";

import {
  DatabaseUserInterface,
  UserInterface,
} from "./src/Interfaces/UserInterface";
const localStrategy = passportLocal.Strategy;

mongoose.connect(
  "mongodb+srv://Navoneel:LvFitIOO4NLjosrl@cluster0.ub7lqey.mongodb.net/?retryWrites=true&w=majority",
  (err: Error) => {
    if (err) throw err;
    console.log("Connected");
  }
);

// Middleware
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cors({ origin: true, credentials: true }));

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

//passport

passport.use(
  new localStrategy((username: string, password: string, done) => {
    User.findOne(
      { username: username },
      (err: any, user: DatabaseUserInterface) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result: boolean) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    );
  })
);

passport.serializeUser((user: DatabaseUserInterface, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: any, user: DatabaseUserInterface) => {
    const userInformation: UserInterface = {
      username: user.username,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

// Routes
app.post("/api/register", async (req, res) => {
  const { username, password } = req?.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.send("Improper Values");
    return;
  }
  User.findOne({ username }, async (err: any, doc: DatabaseUserInterface) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("success");
    }
  });
});

const isAdministratorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user }: any = req;
  if (user) {
    User.findOne(
      { username: user.username },
      (err: any, doc: DatabaseUserInterface) => {
        if (err) throw err;
        if (doc?.isAdmin) {
          next();
        } else {
          res.send("Sorry, only admin's can perform this.");
        }
      }
    );
  } else {
    res.send("Sorry, you arent logged in.");
  }
};

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.send("success");
});

app.get("/api/user", (req, res) => {
  res.send(req.user);
});

app.get("/api/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) throw err;
    //res.redirect('/login');
  });
  res.send("success");
});

app.post("/api/deleteuser", isAdministratorMiddleware, async (req, res) => {
  const { id } = req?.body;
  await User.findByIdAndDelete(id).then(
    (resp: Response) => {
      res.send("success");
    },
    (err: any) => {
      if (err) throw err;
    }
  );
});

// app.get("/getallusers", isAdministratorMiddleware, async (req, res) => {
//   await User.find({}, (err: any, data: DatabaseUserInterface[]) => {
//     if (err) throw err;
//     const filteredUsers: UserInterface[] = [];
//     data.forEach((item: DatabaseUserInterface) => {
//       const userInformation = {
//         id: item._id,
//         username: item.username,
//         isAdmin: item.isAdmin,
//       };
//       filteredUsers.push(userInformation);
//     });
//     res.send(filteredUsers);
//   });
// });

app.get("/api/getallusers", isAdministratorMiddleware, (req, res) => {
  User.find({}).then(
    (data: DatabaseUserInterface[]) => {
      const filteredUsers: UserInterface[] = [];
      data.forEach((item: DatabaseUserInterface) => {
        const userInformation = {
          id: item._id,
          username: item.username,
          isAdmin: item.isAdmin,
        };
        filteredUsers.push(userInformation);
      });
      res.send(filteredUsers);
    },
    (err) => {
      if (err) throw err;
    }
  );
});

app.use(express.static(path.join(__dirname, "../../client/build")));

app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "../../client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server Running on port ${port}`));

module.exports = app;
// app.listen(4000, () => {
//   console.log("Server Started");
// });
