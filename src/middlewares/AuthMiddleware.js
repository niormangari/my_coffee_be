const jwt = require("jsonwebtoken");
const { User: UserModel } = require("../../models");

exports.middleware = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    if (!header) {
      return res.status(401).send({
        status: "fail",
        message: "header required",
      });
    }

    const token = header.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({
        status: "fail",
        message: "token required",
      });
    }

    // verified token
    jwt.verify(token, process.env.SECRETKEY_ACCESS_TOKEN, (error, decode) => {
      if (error) {
        console.log(error);
        return res.status(401).send({
          status: "fail",
          message: "token not verify",
        });
      }
      req.user = decode;
      return next();
    });
    // end verified token
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.middlewareWithLevel = (levels) => {
  return async (req, res, next) => {
    const userDecode = req.user;

    const userById = await UserModel.findOne({
      where: {
        id: userDecode.id,
      },
    });

    if (!userById) {
      return res.status(403).send({
        status: "fail",
        message: "Level Tidak Dibolehkan",
      });
    }

    const userLevel = userById.level;

    if (!levels.includes(userLevel)) {
      return res.status(403).send({
        status: "fail",
        message: "Akses Ditolak",
      });
    }

    // return res.status(403).send({
    //   status: "fail",
    //   message: "Akses Ditolak",
    //   userDecode: userDecode,
    //   user: userById,
    // });

    return next();
  };
};
