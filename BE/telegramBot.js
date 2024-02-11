const TelegramBot = require("node-telegram-bot-api");
const db = require("./db/models/index");
const { Op, where } = require("sequelize");

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
    console.log("err ", err);

    return false;
  }
}

async function sendOrderToMaster(chatId, orderData) {
  try {
    // Формируем текст сообщения с данными заказа
    const message = `Адрес: ${orderData.address}\nТелефон клиента: ${orderData.client_phone}\nВремя встречи: ${orderData.meeting_time}\nМарка: ${orderData.brand}\nТип техники: ${orderData.product_type}`;

    // Отправляем сообщение мастеру
    await bot.sendMessage(chatId, message);
    console.log("Сообщение отправлено мастеру");
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}

// Убедитесь, что у вас есть токен вашего бота
const token = "6883415167:AAFQNSnFL-s73ORXuKuRnjRqlZw0Q7APzGY";
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
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
