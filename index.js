const express = require("express");
const { hashPassword, hashCompare } = require("./hashPassword");
const {
  authentication,
  createToken,
  refreshVerifyToken,
  createRefreshToken,
} = require("./auth");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const { Client, Collection, ObjectId } = require("./database");
const PORT = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.get("/user/:id", authentication, async (req, res) => {
  await Client.connect();
  try {
    let user = await Collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (user) {
      res.json({
        status: 200,
        user,
      });
    } else {
      res.json({
        status: 404,
        message: "Account not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Internal Server Error",
    });
  } finally {
    Client.close();
  }
});
app.post("/sign-up", async (req, res) => {
  await Client.connect();
  try {
    let email = await Collection.find({ email: req.body.email }).toArray();

    if (email.length === 0) {
      let HashPassword = await hashPassword(req.body.password);
      if (HashPassword) {
        let userData = {
          name: req.body.name,
          email: req.body.email,
          password: HashPassword,
          createdAt: Date(),
        };
        let insert = await Collection.insertOne(userData);
        if (insert) {
          res.json({
            status: 200,
            message: "Signup Successful",
          });
        }
      } else {
        res.json({
          status: 403,
          message: "Failed! Retry...",
        });
      }
    } else {
      res.json({
        status: 402,
        message: "User was Already Exist, Please Login...",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Internal Server Error",
    });
  } finally {
    await Client.close();
  }
});
app.post("/sign-in", async (req, res) => {
  await Client.connect();
  try {
    let user = await Collection.find({ email: req.body.email }).toArray();
    if (user.length === 1) {
      let hashResult = await hashCompare(req.body.password, user[0].password);
      if (hashResult) {
        let refresh = await createRefreshToken({
          email: user[0].email,
          name: user[0].name,
        });
        if (refresh) {
          let insert = await Collection.findOneAndUpdate(
            {
              email: user[0].email,
            },
            {
              $set: {
                token: refresh,
              },
            }
          );
          if (insert) {
            let access = await createToken({
              email: user[0].email,
            });
            if (access) {
              res.json({
                status: 200,
                message: "Login Successful",
                access,
                refresh,
                userId: user[0]._id,
              });
            }
          }
        }
      } else {
        res.json({
          status: 402,
          message: "Invalid Credentials",
        });
      }
    } else {
      res.json({
        status: 404,
        message: "User Does not Exist, Please Signup...",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Internal Server Error",
    });
  } finally {
    await Client.close();
  }
});
app.post("/new/token", async (req, res) => {
  await Client.connect();
  try {
    let token = await Collection.find({
      token: req.body.refresh_token,
    }).toArray();
    if (token.length === 1) {
      let verify = await refreshVerifyToken({
        token: token[0].token,
        email: token[0].email,
        name: token[0].name,
      });
      let insert = await Collection.findOneAndUpdate(
        {
          email: token[0].email,
        },
        {
          $set: {
            token: verify.newRefreshToken,
          },
        }
      );
      if (insert && verify.check) {
        let access = await createToken({
          email: token[0].email,
        });
        if (access) {
          res.json({
            status: 200,
            access,
            refresh: verify.newRefreshToken,
          });
        }
      }
    } else {
      res.json({
        status: 401,
        message: "Unauthorized! Please Login...",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Internal Server Error",
    });
  } finally {
    await Client.close();
  }
});
app.delete("/delete/user/:id", authentication, async (req, res) => {
  await Client.connect();
  try {
    let deleteOne = await Collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (deleteOne) {
      res.json({
        status: 200,
        message: "User Account Deleted",
      });
    } else {
      res.json({
        status: 403,
        message: "Account not Found",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: "Internal Server Error",
    });
  } finally {
    await Client.close();
  }
});
app.listen(PORT, () => {
  console.log("Server running into port " + PORT);
});
