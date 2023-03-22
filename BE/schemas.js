exports.schema = {
  user: {
    "create-user": {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        password: { type: "string" },
      },
      required: ["name", "email", "phone", "password"],
      additionalProperties: false,
    },
    "read-user": {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    "read-users": {
      type: "object",
      properties: {
        pagination: {
          type: "object",
          properties: {
            offset: { type: "string" },
            limit: { type: "string" },
          },
        },
        filter: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        order: {
          type: "object",
          properties: {
            field: { type: "string" },
            div: { type: "string" },
          },
        },
      },
      additionalProperties: false,
    },
    "update-user": {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
      },
      required: ["id"],
      additionalProperties: false,
    },
    "delete-user": {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
      additionalProperties: false,
    },
  },
  "animal-card": {
    "create-card": {
      type: "object",
      properties: {
        aviary_number: { type: "string" },
        animal: { type: "string" },
        birthday: { type: "string" },
        moniker: { type: "string" },
        description: { type: "string" },
        food: { type: "string" },
        image: { type: "object" },
      },
      required: [
        "aviary_number",
        "animal",
        "birthday",
        "moniker",
        "description",
        "food",
      ],
    },
    "read-cards": {
      type: "object",
      properties: {},
    },
    "update-card": {
      type: "object",
      properties: {
        id: { type: "string" },
        "aviary_number":{ type: "string" },
        description:{ type: "string" },
        food: { type: "string" },
        "removed":{type:"boolean"}
      },
      required: ["id"],
      additionalProperties: false,
    },
    "delete-card": {
      type: "object",
      properties: {
        id: { type: "string" },
      },
      required: ["id"],
      additionalProperties: false,
    },
  },
};
