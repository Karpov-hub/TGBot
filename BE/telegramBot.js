const TelegramBot = require("node-telegram-bot-api");
const db = require("./db/models/index");
const { Op, where } = require("sequelize");
const token = "6883415167:AAFQNSnFL-s73ORXuKuRnjRqlZw0Q7APzGY";
const bot = new TelegramBot(token, { polling: true });

async function createUser(chatId) {
  try {
    let existUser = await db.user.findOne({
      where: { chat_id: chatId.toString() },
      attributes: ["id"],
    });
    if (existUser) {
      return {
        code: "CHATALREADYREGISTERED",
        message: "Sorry, you can't sign up with this chat id",
      };
    }

    await db.user.create({
      chat_id: chatId,
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function updateOrder(order_id, updatingOptions) {
  try {
    await db.order.update(updatingOptions, {
      where: {
        id: order_id,
      },
    });
    return true;
  } catch (err) {
    return false;
  }
}

async function sendOrderToMaster(chatId, name, surname, orderData) {
  try {
    // Формируем текст сообщения с данными заказа
    const message = `Адрес: ${orderData.address}
    \nТелефон клиента: ${orderData.client_phone}
    \nВремя встречи: ${orderData.meeting_time}
    \nМарка: ${orderData.brand}\nТип техники: ${orderData.product_type}
    \nМастер: ${surname} ${name}`;

    // Создаем кнопку "Принять"
    const acceptButton = {
      text: "Принять",
      callback_data: `accept_order_${orderData.id}`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
    };

    // Формируем клавиатуру с кнопкой
    const keyboard = {
      inline_keyboard: [[acceptButton]],
    };

    // Отправляем сообщение мастеру с клавиатурой
    await bot.sendMessage(chatId, message, { reply_markup: keyboard });
    console.log("Сообщение отправлено мастеру");
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}

// Обработчик нажатия на кнопку "Принять"
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  // Проверяем, что нажата кнопка "Принять"
  if (data.startsWith("accept_order_")) {
    const orderId = data.split("_")[2]; // Получаем идентификатор заказа из callback_data

    // Вызываем функцию обновления заказа
    await updateOrder(orderId, {
      confirmed_at: new Date(),
    });

    // Получаем данные о заказе из базы данных
    const orderData = await db.order.findOne({
      where: {
        id: orderId,
      },
    });
    const masterData = await db.user.findOne({
      where: {
        id: orderData.assigned_master,
      },
      attributes: ["name", "surname"],
    });
    // Отправляем сообщение мастеру о принятии заказа с данными из заказа
    const messageToMaster = `Адрес: ${orderData.address}
    \nТелефон клиента: ${orderData.client_phone}
    \nВремя встречи: ${orderData.meeting_time}
    \nМарка: ${orderData.brand}
    \nТип техники: ${orderData.product_type}
    \nПринял: ${orderData.confirmed_at.toLocaleString()}
    \nМастер: ${masterData.surname} ${masterData.name}`;

    bot.sendMessage(chatId, messageToMaster);

    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);
  }
});

// Обработчик команды /start - регистрация нового мастера
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userCreated = await createUser(chatId);

  if (userCreated === true) {
    bot.sendMessage(chatId, "Привет! Я бот. Как я могу вам помочь?");
  } else if (userCreated && userCreated.code === "CHATALREADYREGISTERED") {
    bot.sendMessage(chatId, userCreated.message);
  } else {
    bot.sendMessage(chatId, "Произошла ошибка при регистрации пользователя.");
  }
});

module.exports = bot;
module.exports = {
  sendOrderToMaster,
};
