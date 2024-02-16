"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let admin1 = await queryInterface.rawSelect(
      { tableName: "admins" },
      {
        where: { id: "fa8d5f5b-81fd-49a6-9c18-8f6cc6d839b5" },
      },
      ["id"]
    );
    if (!admin1)
      await queryInterface.bulkInsert({ tableName: "admins" }, [
        {
          id: "fa8d5f5b-81fd-49a6-9c18-8f6cc6d839b5",
          login: "Karpov",
          password: "3M2syHUgwJ5YPEE4qpMByQ9DC/NrR59XPXPmQEuufN0=", //hse
          status: 0,
        },
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete({ tableName: "admins" }, null, {});
  },
};
