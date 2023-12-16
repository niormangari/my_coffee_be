const { User: UserModel } = require("../../models");

exports.getUser = async (req, res) => {
  // console.log(req.user);
  try {
    const dataUser = await UserModel.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    return res.send({
      status: "success",
      message: "get data user success",
      data: dataUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.getUserById = async (req, res) => {
  const userDecode = req.user;
  const userById = await UserModel.findOne({
    where: {
      id: userDecode.id,
    },
  });

  return res.send({
    status: "success",
    message: "get user success",
    dataUser: userById,
  });
};

exports.updateDataUser = async (req, res) => {
  try {
    const idParam = req.params.idparam;
    const dataInputUpdate = req.body;

    // validasi input
    const validationInput = joi.object({
      fullName: joi.string().min(5),
      email: joi.string().min(5).email(),
    });
    const validationError = validationInput.validate(dataInputUpdate).error;
    if (validationError) {
      return res.status(400).send({
        status: "fail",
        message: validationError.details[0].message,
      });
    }
    // end validasi input

    const dataProductById = await UserModel.findOne({
      where: {
        id: idParam,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!dataProductById) {
      return res.status(400).send({
        status: "fail",
        message: `Data dengan Id: ${idParam} tidak ditemukan`,
      });
    }
    const updateData = await UserModel.update(
      {
        fullname: dataInputUpdate.fullName,
        email: dataInputUpdate.email,
      },
      {
        where: {
          id: idParam,
        },
      }
    );
    if (!updateData) {
      return res.status(400).send({
        status: "fail",
        message: "Update Fail",
      });
    }

    return res.send({
      status: "success",
      message: "Update Data Success",
      data: dataInputUpdate,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "Error Catch",
    });
  }
};
exports.updatePasswordUser = async (req, res) => {
  try {
    const idParam = req.params.idparam;
    const dataInputUpdate = req.body;

    // validasi input
    const validationInput = joi.object({
      password: joi.string().min(3),
      newPassword: joi.string().min(3),
    });
    const validationError = validationInput.validate(dataInputUpdate).error;
    if (validationError) {
      return res.status(400).send({
        status: "fail",
        message: validationError.details[0].message,
      });
    }
    // end validasi input

    const dataUserById = await UserModel.findOne({
      where: {
        id: idParam,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!dataUserById) {
      return res.status(400).send({
        status: "fail",
        message: `Data dengan Id: ${idParam} tidak ditemukan`,
      });
    }

    // compare password
    const compare = await bcrypt.compare(dataInputUpdate.password, dataUserById.password);
    if (compare === false) {
      return res.status(400).send({
        status: "fail",
        message: "Email or password fail",
      });
    }
    // End compare password

    const updateData = await UserModel.update(
      {
        password: await bcrypt.hash(dataInputUpdate.password, 10),
      },
      {
        where: {
          id: idParam,
        },
      }
    );
    if (!updateData) {
      return res.status(400).send({
        status: "fail",
        message: "Update Fail",
      });
    }

    return res.send({
      status: "success",
      message: "Update Data Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "Error Catch",
    });
  }
};
