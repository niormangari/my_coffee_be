const { Cart: CartModel } = require("../../models");
const { v4: uuidv4 } = require("uuid");

exports.getCart = async (req, res) => {
  try {
    const dataCart = await CartModel.findAll();
    return res.send({
      status: "success",
      message: "get data cart success",
      data: dataCart,
    });
  } catch (error) {
    return res.status(500).send({
      status: "fail",
      message: "error catch",
    });
  }
};

exports.addDataCart = async (req, res) => {
  try {
    const userDecode = req.user;
    const productId = req.body.productId;
    let insertOrUpdateToDataBase = null;

    const cartById = await CartModel.findOne({
      where: {
        userId: userDecode.id,
        productId: productId,
      },
    });
    if (cartById) {
      insertOrUpdateToDataBase = await CartModel.update(
        {
          qty: cartById.qty + 1,
        },
        {
          where: {
            id: cartById.id,
          },
        }
      );
    } else {
      insertOrUpdateToDataBase = await CartModel.create({
        id: uuidv4(),
        userId: userDecode.id,
        productId: productId,
        qty: 1,
      });
    }

    return res.send({
      status: "success",
      message: "Add Product to Cart Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "Error Catch",
    });
  }
};

exports.reduceQtyProduct = async (req, res) => {
  try {
    const userDecode = req.user;
    const productId = req.body.productId;
    let insertOrUpdateToDataBase = null;

    const cartById = await CartModel.findOne({
      where: {
        userId: userDecode.id,
        productId: productId,
      },
    });
    if (cartById) {
      // Kurangi kuantitas item dalam keranjang
      const newQty = cartById.qty - 1;

      if (newQty >= 1) {
        // Jika kuantitas masih lebih dari atau sama dengan 1, update kuantitas
        await CartModel.update(
          {
            qty: newQty,
          },
          {
            where: {
              id: cartById.id,
            },
          }
        );
      } else {
        // Jika kuantitas kurang dari 1, hapus item dari keranjang
        await CartModel.destroy({
          where: {
            id: cartById.id,
          },
        });
      }
    }

    return res.send({
      status: "success",
      message: "Add Product to Cart Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "Error Catch",
    });
  }
};

// exports.reduceQtyDataCart = async (req, res) => {
//   try {
//     const idParam = req.params.idparam;

//     const cartById = await cartModel.findOne({
//       where: {
//         id: idParam,
//       },
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });
//     if (!cartById) {
//       return res.status(400).send({
//         status: "fail",
//         message: `Data dengan Id: ${idParam} tidak ditemukan`,
//       });
//     }

//     const addQty = await cartModel.update(
//       {
//         qty: cartById.qty - 1,
//       },
//       {
//         where: {
//           id: cartById.id,
//         },
//       }
//     );
//     if (!addQty) {
//       return res.status(400).send({
//         status: "fail",
//         message: "reduce Qty Fail",
//       });
//     }

//     return res.send({
//       status: "success",
//       message: "reduce Qty success",
//       qty: cartById.qty,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({
//       status: "fail",
//       message: "Error Catch",
//     });
//   }
// };

exports.deleteDataCart = async (req, res) => {
  try {
    const idParam = req.params.idparam;

    const dataCartById = await CartModel.findOne({
      where: {
        id: idParam,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!dataCartById) {
      return res.status(400).send({
        status: "fail",
        message: `Data dengan Id: ${idParam} tidak ditemukan`,
      });
    }

    const deleteProduct = await CartModel.destroy({
      where: {
        id: idParam,
      },
    });
    if (!deleteProduct) {
      return res.status(400).send({
        status: "fail",
        message: "Delete Data Cart Fail",
      });
    }
    return res.send({
      status: "success",
      message: "Delete Data Cart Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "fail",
      message: "Error Catch",
    });
  }
};
