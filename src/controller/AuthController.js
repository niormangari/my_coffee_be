const { User: UserModel } = require("../../models");
const joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const dataInput = req.body;

    // validation input
    const validationInput = joi.object({
      email: joi.string().required().min(5).email(),
      fullname: joi.string().required().min(3),
      password: joi.string().required().min(3),
      level: joi.string().required().valid("admin", "customer", "owner"),
    });
    const validationError = validationInput.validate(dataInput).error;
    if (validationError) {
      return res.status(400).send({
        status: "fail",
        message: validationError.details[0].message,
      });
    }
    // end validation input

    const id = uuidv4();
    const hashPassword = await bcrypt.hash(dataInput.password, 10);

    // check data allready exist
    const dataByEmail = await UserModel.findOne({
      where: {
        email: dataInput.email,
      },
    });
    if (dataByEmail) {
      return res.status(400).send({
        status: "fail",
        message: `user with email: ${dataInput.email} allready exist`,
      });
    }
    const dataByFullname = await UserModel.findOne({
      where: {
        fullname: dataInput.fullname,
      },
    });
    if (dataByFullname) {
      return res.status(400).send({
        status: "fail",
        message: `user with fullname: ${dataInput.fullname} allready exist`,
      });
    }
    // end check data allready exist

    // insert database
    const insertData = await UserModel.create({
      id: id,
      email: dataInput.email,
      fullname: dataInput.fullname,
      password: hashPassword,
      level: dataInput.level,
    });
    if (!insertData) {
      return res.status(400).send({
        status: "fail",
        message: "insert data fail",
      });
    }
    // end insert database

    return res.send({
      status: "success",
      message: "register success",
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const dataInput = req.body;

    // validation input
    const validationInput = joi.object({
      email: joi.string().required().min(5).email(),
      password: joi.string().required().min(3),
    });
    const validationError = validationInput.validate(dataInput).error;
    if (validationError) {
      return res.status(400).send({
        status: "fail",
        message: validationError.details[0].message,
      });
    }
    // end validation input

    //  data user by email
    const dataUserByEmail = await UserModel.findOne({
      where: {
        email: dataInput.email,
      },
    });
    if (!dataUserByEmail) {
      return res.status(404).send({
        status: "fail",
        message: "email or password is fail",
      });
    }
    //  end data user by email

    // compare password
    const comparePassword = await bcrypt.compare(dataInput.password, dataUserByEmail.password);
    if (!comparePassword) {
      return res.status(400).send({
        status: "fail",
        message: "email or password is fail",
      });
    }
    // end compare password

    // make token
    const token = jwt.sign(
      {
        id: dataUserByEmail.id,
      },
      process.env.SECRETKEY_ACCESS_TOKEN
    );
    // end make token

    return res.send({
      status: "success",
      message: "login success",
      data: {
        id: dataUserByEmail.id,
        email: dataUserByEmail.email,
        fullname: dataUserByEmail.fullname,
        level: dataUserByEmail.level,
      },
      token,
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.checkToken = async (req, res) => {
  try {
    const decodeUser = req.user;
    const dataUser = await UserModel.findOne({
      where: {
        id: decodeUser.id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });
    if (!decodeUser) {
      return res.status(404).send({
        status: "fail",
        message: "user not found",
      });
    }

    return res.send({
      status: "success",
      message: `check token success`,
      user: dataUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};
