const db = require("../db/models/index");
const { Op, where } = require("sequelize");
//addMaster deleteMaster getQueue
//changeStatusMaster readMasters
const Queue = require("@queue");
const queue = new Queue();

// // Добавление мастеров в очередь
// queue.enqueue("Master1");
// queue.enqueue("Master2");
// queue.enqueue("Master3");

// // Если мастер становится занятым, переместите его в конец очереди
// queue.moveToBack("Master1");

// // Удаление мастера из начала очереди (принятие заказа)
// const nextMaster = queue.dequeue();
// console.log("Next master:", nextMaster);

async function readAdmins(req, res) {
  try {
    let { count, rows } = await db.admin.findAndCountAll({
      offset: req.body.start,
      limit: req.body.limit,
    });

    return res.send({ success: true, count, rows });
  } catch (err) {
    return res.send({ success: false, err });
  }
}

async function updateAdmin(req, res) {
  try {
    const updatingOptions = {
      login: req.body.login,
      password: req.body.password,
    };

    await db.admin.update(updatingOptions, {
      where: {
        id: req.body.id,
      },
    });
    return res.send({ success: true });
  } catch (err) {
    return res.send({ success: false, err });
  }
}
async function updateUserStatus(req, res) {
  try {
    const updatingOptions = {
      status: req.body.status,
    };

    await db.user.update(updatingOptions, {
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
  readAdmins,
  updateAdmin,
};
