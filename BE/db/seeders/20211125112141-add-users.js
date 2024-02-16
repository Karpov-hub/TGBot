"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let user1 = await queryInterface.rawSelect(
      { tableName: "users" },
      {
        where: { id: "0a29b7d7-7294-45a9-a920-790371bf6611" },
      },
      ["id"]
    );
    if (!user1)
      await queryInterface.bulkInsert({ tableName: "users" }, [
        {
          id: "0a29b7d7-7294-45a9-a920-790371bf6611",
          chat_id: "5739980625",
          name: "Admin",
        },
      ]);
    let user2 = await queryInterface.rawSelect(
      { tableName: "users" },
      {
        where: { id: "fd9a91e2-e138-4f42-a687-32fcc1515cf3" },
      },
      ["id"]
    );
    if (!user2)
      await queryInterface.bulkInsert({ tableName: "users" }, [
        {
          id: "fd9a91e2-e138-4f42-a687-32fcc1515cf3",
          chat_id: "6930022894",
          name: "Данила",
          surname: "Людвиг",
          patronymic: "Сергеевич",
          phone: "+7 927 793 3556",
        },
      ]);
    let user3 = await queryInterface.rawSelect(
      { tableName: "users" },
      {
        where: { id: "f1c4446e-c509-4be0-a57c-e11a034dbeb5" },
      },
      ["id"]
    );
    if (!user3)
      await queryInterface.bulkInsert({ tableName: "users" }, [
        {
          id: "f1c4446e-c509-4be0-a57c-e11a034dbeb5",
          chat_id: "6930022894",
          name: "Рафит",
          surname: "Галиакбаров",
          // patronymic: "Сергеевич",
          phone: "+7 996 900 6131",
        },
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete({ tableName: "users" }, null, {});
  },
};
