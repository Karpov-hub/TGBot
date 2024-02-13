const TelegramBot = require("node-telegram-bot-api");
const db = require("./db/models/index");
const { Op, where } = require("sequelize");
const token = "6883415167:AAFQNSnFL-s73ORXuKuRnjRqlZw0Q7APzGY";
const bot = new TelegramBot(token, { polling: true });

let getDeposit = 0;
let getAmount = 0;
let getExpenses = 0;
let getComment = 0;

let departedLocation = 0;
let startedLocation = 0;
let completedLocation = 0;

let idMes = null;
let idMes2 = null;
let idMes3 = null;
let idOrder = null;

let amountClose = null;
let expensesClose = null;
let geoClose = null;
let photoClose = [];
let commentClose = null;

let photoQuantity = 0;

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
async function getOrderIdText(messageText) {
  const idMatch = messageText.match(
    /ID: \s*([a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12})/i
  );
  // Получить значение id из результатов сопоставления
  return idMatch ? idMatch[1] : null;
}
async function parseNum(depositAmount) {
  depositA = parseInt(depositAmount); // Парсим ответ пользователя в числовой формат
  if (isNaN(depositA)) {
    // Проверяем, является ли ответ числом
    return false;
  }
  return true;
}

//Телеграм АПИ
// Обработчик события "Нажатие кнопок"
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  const messageText = callbackQuery.message.text;

  const orderId = await getOrderIdText(messageText);

  // Проверяем, что нажата кнопка "Принять"
  if (data.startsWith("accept_order")) {
    await buttonDeparted(orderId, chatId, messageId);
  }
  // Проверяем, что нажата кнопка "выехал"
  else if (data.startsWith("departed")) {
    await buttonGeoDeparted(orderId, chatId, messageId);
  }
  // Проверяем, что нажата кнопка "геопозиция выехал"
  else if (data.startsWith("geo_departed")) {
    await buttonStartWork(orderId, chatId, messageId);
  }
  // Проверяем, что нажата кнопка "Начал"
  else if (data.startsWith("star_work")) {
    await buttonGeoStartWork(orderId, chatId, messageId);
  }
  // Проверяем, что нажата кнопка "Задаток"
  else if (data.startsWith("getDeposit")) {
    getDeposit = 1;
    idMes = messageId;
    idOrder = orderId;
    const response = await bot.sendMessage(chatId, "Введите задаток: ");
    idMes2 = response.message_id; // Получаем идентификатор отправленного сообщения
  }
  // Проверяем, что нажата кнопка "Завершить"
  else if (data.startsWith("closeOrder")) {
    await buttonGeoCloseOrder(orderId, chatId, messageId);
  }
  // Проверяем, что нажата кнопка "Подтвердить закрытие"
  else if (data.startsWith("confirm")) {
    bot.deleteMessage(chatId, messageId);
    await report(orderId, chatId);
    //здесь нужно выполнить запись данных в бд
    //И вывести новое сообщение со всеми данными без кнопок
  }
  // Проверяем, что нажата кнопка "Назад"
  else if (data.startsWith("back")) {
    amountClose = null;
    expensesClose = null;
    geoClose = null;
    photoClose = [];
    commentClose = null;
    bot.deleteMessage(chatId, messageId);
    buttonCloseOrder(orderId, chatId);
  }
});
// Обработчик события "Отправка Гео"
bot.on("location", async (msg) => {
  if (departedLocation || startedLocation || completedLocation) {
    try {
      const chatId = msg.chat.id;
      const location = msg.location;
      // const orderId = await getOrderIdText(msg.reply_to_message.text);
      const orderData = await getOrderDate(idOrder);

      //гео выехал
      if (!orderData.orderData.departed_location) {
        await updateOrder(idOrder, {
          departed_location: location.toString(),
        });
        departedLocation = 0;
        await buttonStartWork(idOrder, chatId);
      }
      //гео начал
      else if (!orderData.orderData.started_location) {
        await updateOrder(idOrder, {
          started_location: location.toString(),
        });
        startedLocation = 0;
        await buttonPushDeposit(idOrder, chatId);
      }
      //гео закончил
      else if (!orderData.orderData.completed_location) {
        geoClose = location;
        completedLocation = 0;
        await inputVal(idOrder, chatId);
      }
      bot.deleteMessage(chatId, msg.message_id);
      bot.deleteMessage(chatId, idMes);
    } catch (error) {
      console.error("Ошибка при обработке местоположения:", error);
    }
  }
});
// Обработчик события "Отправка Текса"
bot.on("message", async (msg) => {
  if (getDeposit || getAmount || getExpenses || getComment) {
    try {
      const chatId = msg.chat.id;
      const orderData = await getOrderDate(idOrder);
      //Если нет задатка
      if (
        getDeposit &&
        !orderData.orderData.deposit_amount &&
        (await parseNum(msg.text))
      ) {
        await updateOrder(idOrder, {
          deposit_amount: msg.text,
          deposit_received_at: new Date(),
        });
        getDeposit = 0;
        bot.deleteMessage(chatId, idMes);
        bot.deleteMessage(chatId, idMes2);
        bot.deleteMessage(chatId, msg.message_id);
        await buttonCloseOrder(idOrder, chatId);
      }
      //Если нет суммы
      else if (
        getAmount &&
        !orderData.orderData.amount &&
        (await parseNum(msg.text))
      ) {
        amountClose = msg.text;
        getAmount = 0;
        bot.deleteMessage(chatId, idMes2);
        bot.deleteMessage(chatId, msg.message_id);

        getExpenses = 1;
        const response = await bot.sendMessage(chatId, "Введите расход: ");
        idMes2 = response.message_id; // Получаем идентификатор отправленного сообщения
      }
      //Если нет расхода
      else if (
        getExpenses &&
        !orderData.orderData.expenses &&
        (await parseNum(msg.text))
      ) {
        expensesClose = msg.text;
        getExpenses = 0;
        bot.deleteMessage(chatId, idMes2);
        bot.deleteMessage(chatId, msg.message_id);

        getComment = 1;
        const response = await bot.sendMessage(chatId, "Введите комментарий: ");
        idMes2 = response.message_id; // Получаем идентификатор отправленного сообщения
      }
      //Если нет коммента
      else if (getComment && !orderData.orderData.comment) {
        commentClose = msg.text;
        getComment = 0;
        bot.deleteMessage(chatId, idMes3);
        bot.deleteMessage(chatId, idMes2);
        bot.deleteMessage(chatId, msg.message_id);
        photoQuantity = 4;
        await confirmClose(idOrder, chatId);
      }
    } catch (error) {
      console.error("Ошибка при обработке сообщения:", error);
    }
  }
});
// Обработчик события "Отправка Фото"
bot.on("photo", async (msg) => {
  try {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const photo = msg.photo[0].file_id; // Получаем массив фотографий
    await bot.deleteMessage(chatId, messageId);
    if (photoQuantity) {
      photoClose.push(photo);
      photoQuantity--;
      if (!photoQuantity) {
        console.log("photoQuantity");

        confirmClose(orderId, chatId);
      }
    }
    // await bot.sendPhoto(chatId, photo);
  } catch (error) {
    console.error("Ошибка при обработке сообщения:", error);
  }
});

// Обработчик нажатия на кнопку "Принять"
async function sendOrderToMaster(chatId, name, surname, orderData) {
  try {
    // Формируем текст сообщения с данными заказа
    const message = `ID: ${orderData.id}\nАдрес: ${orderData.address}\nТелефон клиента: ${orderData.client_phone}\nВремя встречи: ${orderData.meeting_time}\nМарка: ${orderData.brand}\nПричина обращения: ${orderData.breakage_type}\nТип техники: ${orderData.product_type}\nМастер: ${surname} ${name}`;
    // Создаем кнопку "Принять"
    const acceptButton = {
      text: "Принять",
      callback_data: `accept_order`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
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
async function buttonDeparted(orderId, chatId, messageId) {
  try {
    // Вызываем функцию обновления заказа
    await updateOrder(orderId, {
      confirmed_at: new Date(),
    });
    const data = await getOrderDate(orderId);

    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);

    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    // Создаем кнопку "Выехал"
    const acceptButton = {
      text: "Выехал",
      callback_data: `departed`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
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
async function buttonGeoDeparted(orderId, chatId, messageId) {
  try {
    // Вызываем функцию обновления заказа
    await updateOrder(orderId, {
      departed_at: new Date(),
    });

    const data = await getOrderDate(orderId);
    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);
    idOrder = data.orderData.id;
    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    const requestLocationButton = {
      text: "Отправить геопозицию",
      request_location: true, // Это свойство запрашивает у пользователя его текущую геопозицию
    };

    // Формируем клавиатуру с кнопкой для запроса геопозиции
    const keyboard = {
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [[requestLocationButton]],
    };
    departedLocation = 1;
    // Отправляем сообщение мастеру с клавиатурой
    const response = await bot.sendMessage(chatId, message, {
      reply_markup: keyboard,
    });
    // Сохраняем идентификатор отправленного сообщения
    idMes = response.message_id;
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "Начал"
async function buttonStartWork(orderId, chatId) {
  try {
    const data = await getOrderDate(orderId);
    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    // Создаем кнопку "Начал"
    const acceptButton = {
      text: "Начал",
      callback_data: `star_work`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
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
// Обработчик нажатия на кнопку "Гео начал"
async function buttonGeoStartWork(orderId, chatId, messageId) {
  try {
    // Вызываем функцию обновления заказа
    await updateOrder(orderId, {
      started_at: new Date(),
    });

    const data = await getOrderDate(orderId);
    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);
    idOrder = data.orderData.id;
    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    const requestLocationButton = {
      text: "Отправить геопозицию",
      request_location: true, // Это свойство запрашивает у пользователя его текущую геопозицию
    };

    // Формируем клавиатуру с кнопкой для запроса геопозиции
    const keyboard = {
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [[requestLocationButton]],
    };
    startedLocation = 1;
    // Отправляем сообщение мастеру с клавиатурой
    const response = await bot.sendMessage(chatId, message, {
      reply_markup: keyboard,
    });
    // Сохраняем идентификатор отправленного сообщения
    idMes = response.message_id;
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "Задаток"
async function buttonPushDeposit(orderId, chatId) {
  try {
    const data = await getOrderDate(orderId);
    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nМастер: ${
      data.masterData.surname
    } ${data.masterData.name}`;

    // Создаем кнопку "Задаток"
    const acceptButton = {
      text: "Задаток",
      callback_data: `getDeposit`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
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
// Обработчик нажатия на кнопку "Завершить"
async function buttonCloseOrder(orderId, chatId) {
  try {
    const data = await getOrderDate(orderId);
    // Отправляем сообщение мастеру о начале заказа с данными из заказа
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nЗадаток: ${
      data.orderData.deposit_amount
    }\nМастер: ${data.masterData.surname} ${data.masterData.name}`;

    // Создаем кнопку "Завершить"
    const acceptButton = {
      text: "Завершить",
      callback_data: `closeOrder`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
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
// Обработчик нажатия на кнопку "Гео Закрыть"
async function buttonGeoCloseOrder(orderId, chatId, messageId) {
  try {
    const data = await getOrderDate(orderId);
    idOrder = data.orderData.id;
    // Удаляем инлайн-клавиатуру после нажатия на кнопку
    bot.deleteMessage(chatId, messageId);

    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nЗадаток: ${
      data.orderData.deposit_amount
    }\nМастер: ${data.masterData.surname} ${data.masterData.name}`;
    completedLocation = 1;
    const requestLocationButton = {
      text: "Отправить геопозицию",
      request_location: true, // Это свойство запрашивает у пользователя его текущую геопозицию
    };

    // Формируем клавиатуру с кнопкой для запроса геопозиции
    const keyboard = {
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [[requestLocationButton]],
    };
    startedLocation = 1;
    // Отправляем сообщение мастеру с клавиатурой
    const response = await bot.sendMessage(chatId, message, {
      reply_markup: keyboard,
    });
    // Сохраняем идентификатор отправленного сообщения
    idMes = response.message_id;
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "Закрыть"
async function inputVal(orderId, chatId) {
  try {
    const data = await getOrderDate(orderId, chatId);
    // bot.deleteMessage(chatId, idMes);
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nЗадаток: ${
      data.orderData.deposit_amount
    }\nМастер2: ${data.masterData.surname} ${data.masterData.name}`;
    // Отправляем сообщение мастеру с клавиатурой
    const response = await bot.sendMessage(chatId, message);
    // Сохраняем идентификатор отправленного сообщения
    idMes3 = response.message_id;

    // Отправляем сообщение мастеру с клавиатурой
    const response2 = await bot.sendMessage(chatId, "Введите сумму: ");
    // Сохраняем идентификатор отправленного сообщения
    idMes2 = response2.message_id;
    getAmount = 1;
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "подтвердить закрытие"
async function confirmClose(orderId, chatId) {
  try {
    const data = await getOrderDate(orderId, chatId);

    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nЗадаток: ${
      data.orderData.deposit_amount
    }\nМастер: ${data.masterData.surname} ${
      data.masterData.name
    }\n\nСумма: ${amountClose}\nРасход: ${expensesClose}\nКомментарий: ${commentClose}\n\nВы можете добавить до 4 фото:`;

    // Создаем кнопку "Подтвердить"
    const confirmButton = {
      text: "Подтвердить",
      callback_data: `confirm`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
    };
    // Создаем кнопку "Назад"
    const backButton = {
      text: "Назад",
      callback_data: `back`, // Данные, которые будут отправлены обратно боту при нажатии на кнопку
    };
    // Формируем клавиатуру с кнопкой
    const keyboard = {
      inline_keyboard: [[confirmButton], [backButton]],
    };
    // Отправляем сообщение мастеру с клавиатурой
    await bot.sendMessage(chatId, message, { reply_markup: keyboard });
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик нажатия на кнопку "подтвердить закрытие"
async function report(orderId, chatId) {
  try {
    // Вызываем функцию обновления заказа
    let orderData = {
      completed_at: new Date(),
      amount: amountClose,
      expenses: expensesClose,
      comment: commentClose,
      completed_location: geoClose.toString(),
    };
    if (photoClose.length > 0) {
      orderData.photo_urls = photoClose;
    }
    await updateOrder(orderId, orderData);

    const data = await getOrderDate(orderId, chatId);
    const message = `ID: ${data.orderData.id}\nАдрес: ${
      data.orderData.address
    }\nТелефон клиента: ${data.orderData.client_phone}\nВремя встречи: ${
      data.orderData.meeting_time
    }\nМарка: ${data.orderData.brand}\nПричина обращения: ${
      data.orderData.breakage_type
    }\nТип техники: ${
      data.orderData.product_type
    }\nПринял: ${data.orderData.confirmed_at.toLocaleString()}\nВыехал: ${data.orderData.departed_at.toLocaleString()}\nНачал: ${data.orderData.started_at.toLocaleString()}\nЗадаток: ${
      data.orderData.deposit_amount
    }\nМастер: ${data.masterData.surname} ${data.masterData.name}\n\nСумма: ${
      data.orderData.amount
    }\nРасход: ${data.orderData.expenses}\nКомментарий: ${
      data.orderData.comment
    }\nЗакрыл: ${data.orderData.completed_at.toLocaleString()}`;
    bot.sendMessage(chatId, message);

    if (photoClose.length > 0) {
      let media = [];
      photoClose.forEach((element) => {
        media.push({ type: "photo", media: element });
      });

      bot.sendMediaGroup(chatId, media);
      photoClose = [];
    }

    // Отправляем сообщение мастеру с клавиатурой
  } catch (error) {
    console.error("Ошибка при отправке сообщения мастеру:", error);
  }
}
// Обработчик команды /start - регистрация нового мастера
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userCreated = await createUser(chatId);

  if (userCreated === true) {
    bot.sendMessage(chatId, "Добро пожаловать! Я бот.");
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
