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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete({ tableName: "users" }, null, {});
  },
};
