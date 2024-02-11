const TelegramBot = require("node-telegram-bot-api");
const db = require("./db/models/index");
const { Op, where } = require("sequelize");
const token = "6883415167:AAFQNSnFL-s73ORXuKuRnjRqlZw0Q7APzGY";
const bot = new TelegramBot(token, { polling: true });
//база данных
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
async function getOrderDate(orderId) {
  try {
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
    return {
      orderData: orderData,
      masterData: masterData,
    };
  } catch (err) {
    return false;
  }
}

//Телеграм АПИ
// Обработчик нажатия на кнопки
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;

  // Проверяем, что нажата кнопка "Принять"
  if (data.startsWith("accept_order_")) {
    const orderId = data.split("_")[2]; // Получаем идентификатор заказа из callback_data
    await buttonDeparted(orderId, chatId, messageId, data);
  }
  // Проверяем, что нажата кнопка "выехал"
  if (data.startsWith("departed__")) {
    const orderId = data.split("_")[2];
    await buttonGeoDeparted(orderId, chatId, messageId, data);
  }
  // Проверяем, что нажата кнопка "геопозиция выехал"
  if (data.startsWith("geo_departed_")) {
    const orderId = data.split("_")[2];
    await buttonStartWork(orderId, chatId, messageId, data);
  }
  // Проверяем, что нажата кнопка "Начал"
  if (data.startsWith("star_work_")) {
    const orderId = data.split("_")[2];
    await buttonGeoStartWork(orderId, chatId, messageId, data);
  }
});
async function sendOrderToMaster(chatId, name, surname, orderData) {
  try {
    // Формируем текст сообщения с данными заказа
    const message = `Адрес: ${orderData.address}\nТелефон клиента: ${orderData.client_phone}\nВремя встречи: ${orderData.meeting_time}\nМарка: ${orderData.brand}\nТип техники: ${orderData.product_type}\nМастер: ${surname} ${name}`;
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
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "Выехал"
async function buttonDeparted(orderId, chatId, messageId, data) {
  try {
    // Вызываем функцию обновления заказа
    await updateOrder(orderId, {
      confirmed_at: new Date(),
    });
    const data = await getOrderDate(orderId);
    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);

    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `Адрес: ${data.orderData.address}\nТелефон клиента: ${
      data.orderData.client_phone
    }\nВремя встречи: ${data.orderData.meeting_time}\nМарка: ${
      data.orderData.brand
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;
    // Создаем кнопку "Выехал"
    const acceptButton = {
      text: "Выехал",
      callback_data: `departed__${data.orderData.id}`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
    };

    // Формируем клавиатуру с кнопкой
    const keyboard = {
      inline_keyboard: [[acceptButton]],
    };

    // Отправляем сообщение мастеру с клавиатурой
    await bot.sendMessage(chatId, message, { reply_markup: keyboard });
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "Гео выехал"
async function buttonGeoDeparted(orderId, chatId, messageId, data) {
  try {
    // Вызываем функцию обновления заказа
    await updateOrder(orderId, {
      departed_at: new Date(),
    });

    const data = await getOrderDate(orderId);
    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);

    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `Адрес: ${data.orderData.address}\nТелефон клиента: ${
      data.orderData.client_phone
    }\nВремя встречи: ${data.orderData.meeting_time}\nМарка: ${
      data.orderData.brand
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    // Создаем кнопку "Геопозиция"
    const acceptButton = {
      text: "Геопозиция",
      callback_data: `geo_departed_${data.orderData.id}`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
    };

    // Формируем клавиатуру с кнопкой
    const keyboard = {
      inline_keyboard: [[acceptButton]],
    };

    // Отправляем сообщение мастеру с клавиатурой
    await bot.sendMessage(chatId, message, { reply_markup: keyboard });
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "Начал"
async function buttonStartWork(orderId, chatId, messageId, data) {
  try {
    // Вызываем функцию обновления заказа
    // await updateOrder(orderId, {
    //   // departed_location: new Date(), //здесь должно быть указание гео
    // });
    const data = await getOrderDate(orderId);
    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);

    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `Адрес: ${data.orderData.address}\nТелефон клиента: ${
      data.orderData.client_phone
    }\nВремя встречи: ${data.orderData.meeting_time}\nМарка: ${
      data.orderData.brand
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    // Создаем кнопку "Начал"
    const acceptButton = {
      text: "Начал",
      callback_data: `star_work_${data.orderData.id}`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
    };

    // Формируем клавиатуру с кнопкой
    const keyboard = {
      inline_keyboard: [[acceptButton]],
    };

    // Отправляем сообщение мастеру с клавиатурой
    await bot.sendMessage(chatId, message, { reply_markup: keyboard });
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "отправить геопозицию начал"
async function buttonGeoStartWork(orderId, chatId, messageId, data) {
  try {
    // Вызываем функцию обновления заказа
    await updateOrder(orderId, {
      started_at: new Date(),
    });
    // // Вызываем функцию обновления заказа
    // await updateOrder(orderId, {
    //   // started_location: new Date(),
    // });

    const data = await getOrderDate(orderId);
    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);

    const message = `Адрес: ${data.orderData.address}\nТелефон клиента: ${
      data.orderData.client_phone
    }\nВремя встречи: ${data.orderData.meeting_time}\nМарка: ${
      data.orderData.brand
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    // Создаем кнопку "Геопозиция"
    const acceptButton = {
      text: "Геопозиция",
      callback_data: `star_work_${data.orderData.id}`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
    };

    // Формируем клавиатуру с кнопкой
    const keyboard = {
      inline_keyboard: [[acceptButton]],
    };

    // Отправляем сообщение мастеру с клавиатурой
    await bot.sendMessage(chatId, message, { reply_markup: keyboard });
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
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
