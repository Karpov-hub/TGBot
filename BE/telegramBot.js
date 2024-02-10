const TelegramBot = require("node-telegram-bot-api");

// Убедитесь, что у вас есть токен вашего бота
const token = "6883415167:AAFQNSnFL-s73ORXuKuRnjRqlZw0Q7APzGY";
const bot = new TelegramBot(token, { polling: true });

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Привет! Я бот. Как я могу вам помочь?");
});

module.exports = bot;
