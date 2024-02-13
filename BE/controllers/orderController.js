const db = require("../db/models/index");
const { Op, where } = require("sequelize");
const { sendOrderToMaster } = require("../telegramBot");

// async function createOrder(req, res) {
//   try {
//     await db.order.create({
//       address: req.body.address,
//       client_phone: req.body.client_phone,
//       meeting_time: req.body.meeting_time,
//       brand: req.body.brand,
//       product_type: req.body.product_type,
//       assigned_master: req.body.assigned_master,
//     });
//     return res.send({ success: true });
//   } catch (err) {
//     return res.send({ success: false, err });
//   }
// }

async function createOrder(req, res) {
  try {
    await db.order.create({
      address: req.body.address,
      client_phone: req.body.client_phone,
      meeting_time: req.body.meeting_time,
      brand: req.body.brand,
      product_type: req.body.product_type,
      assigned_master: null,
      breakage_type: req.body.breakage_type,
    });
    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function readUnassignedOrders(req, res) {
  try {
    let { count, rows } = await db.order.findAndCountAll({
      where: { assigned_master: null },
    });

    return res.send({ success: true, count, rows });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function placeOrder(req, res) {
  try {
    const updatingOptions = {
      assigned_master: req.body.master_id,
    };

    await db.order.update(updatingOptions, {
      where: {
        id: req.body.order_id,
      },
    });

    // Получаем chat_id мастера, назначенного на заказ
    const master = await db.user.findOne({
      where: { id: req.body.master_id },
      attributes: ["chat_id", "name", "surname"],
    });

    const order = await db.order.findOne({
      where: { id: req.body.order_id },
      attributes: [
        "id",
        "address",
        "client_phone",
        "meeting_time",
        "brand",
        "product_type",
      ],
    });

    // Если у мастера есть chat_id, отправляем ему сообщение
    if (master && master.chat_id) {
      await sendOrderToMaster(
        master.chat_id,
        master.name,
        master.surname,
        order
      );
    } else {
      console.log("Не удалось отправить сообщение мастеру: chat_id не найден");
    }

    return res.send({ success: true });
  } catch (err) {
    console.error("Ошибка при создании заказа:", err);
    return res.send({ success: false, err });
  }
}

async function readOrders(req, res) {
  try {
    let { count, rows } = await db.order.findAndCountAll();

    return res.send({ success: true, count, rows });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function updateOrder(req, res) {
  try {
    const updatingOptions = {
      email: req.body.email,
      password: req.body.password,
      surname: req.body.surname,
      name: req.body.name,
      patronymic: req.body.patronymic,
      phone: req.body.phone,
      roll: req.body.roll,
    };

    await db.order.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function deleteOrder(req, res) {
  try {
    await db.order.destroy({
      where: {
        id: req.body.id,
      },
    });

    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

module.exports = {
  createOrder,
  readOrders,
  updateOrder,
  deleteOrder,
  placeOrder,
  readUnassignedOrders,
};
