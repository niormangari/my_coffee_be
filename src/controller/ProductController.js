const { TbProduct } = require("../../models");
const joi = require("joi");
const { v4: uuidv4 } = require("uuid");

exports.addProduct = async (req, res) => {
  try {
    const dataInput = req.body;

    // check imageFilter
    if (req.fileValidationError) {
      return res.status(400).send({
        status: "fail",
        message: req.fileValidationError,
      });
    }
    // end check imageFilter

    // validation input
    const validationInput = joi.object({
      productName: joi.string().required().min(5),
      price: joi.number().required(),
    });
    const validationError = validationInput.validate(dataInput).error;
    if (validationError) {
      return res.status(400).send({
        status: "fail",
        message: "validate error",
        error: validationError.details[0].message,
      });
    }
    // end validation input

    const uuid = uuidv4();

    // check data allready exist
    const productById = await TbProduct.findOne({
      where: {
        id: uuid,
      },
    });
    if (productById) {
      return res.status(400).send({
        status: "fail",
        message: `data with id: ${uuid} allready exist`,
      });
    }

    const productByName = await TbProduct.findOne({
      where: {
        productName: dataInput.productName,
      },
    });
    if (productByName) {
      return res.status(400).send({
        status: "fail",
        message: `data with name: ${dataInput.productName} allready exist`,
      });
    }
    // end check data allready exist

    // insert data
    const insertData = await TbProduct.create({
      id: uuid,
      productName: dataInput.productName,
      price: dataInput.price,
      qty: dataInput.qty,
      img: req.file.originalname,
    });
    if (!insertData) {
      return res.status(401).send({
        status: "fail",
        message: "add data product fail",
      });
    }
    // end insert data

    // success
    return res.send({
      status: "success",
      message: "add data product success",
      data: insertData,
    });
    // end success
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const dataProducts = await TbProduct.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (dataProducts.length <= 0) {
      return res.status(400).send({
        status: "fail",
        message: "data product null",
        data: [],
      });
    }

    return res.send({
      status: "success",
      message: "get data product success",
      data: dataProducts,
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.idparam;

    const productById = await TbProduct.findOne({
      where: {
        id: id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!productById) {
      return res.status(404).send({
        status: "fail",
        message: `data with id: ${id} not found`,
        data: [],
      });
    }

    return res.send({
      status: "success",
      message: "get data product by id success",
      data: productById,
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.idparam;
    const dataProduct = req.body;

    // check data allready exist
    const productById = await TbProduct.findOne({
      where: {
        id: id,
      },
    });
    if (!productById) {
      return res.status(404).send({
        status: "fail",
        message: `data with id: ${id} not found`,
      });
    }
    // end check data allready exist

    // process update
    const dataUpdate = await TbProduct.update(
      {
        qty: dataProduct.qty,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (!dataUpdate) {
      return res.status(400).send({
        status: "fail",
        message: "update data fail",
      });
    }
    // end process update

    return res.send({
      status: "success",
      message: "update data success",
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.idparam;

    // check data allready exist
    const productById = await TbProduct.findOne({
      where: {
        id: id,
      },
    });
    if (!productById) {
      return res.status(404).send({
        status: "fail",
        message: `data with id: ${id} not found`,
      });
    }
    // end check data allready exist

    const dataDelete = await TbProduct.destroy({
      where: {
        id: id,
      },
    });
    if (!dataDelete) {
      return res.status(400).send({
        status: "fail",
        message: "delete data fail",
      });
    }

    return res.send({
      status: "success",
      message: "delete data success",
      data: id,
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};
