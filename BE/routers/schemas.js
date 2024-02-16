module.exports = {
  auth: {
    signin: {
      type: "object",
      properties: {
        login: { type: "string" },
        password: { type: "string" },
      },
      required: ["login", "password"],
    },
    refreshToken: {
      type: "object",
      properties: {
        session_token: { type: "string" },
      },
      required: ["session_token"],
    },
    logout: {
      type: "object",
      properties: {
        session_token: { type: "string" },
      },
      required: ["session_token"],
    },
    "change-password": {
      type: "object",
      properties: {
        session_token: { type: "string" },
        password: { type: "string" },
      },
      required: ["session_token", "password"],
    },
  },
  order: {
    "create-order": {
      type: "object",
      properties: {
        // session_token: { type: "string" },
        address: { type: "string", maxLength: 100 },
        client_phone: { type: "string", maxLength: 20 },
        meeting_time: { type: "string", maxLength: 5 },
        brand: { type: "string", maxLength: 20 },
        product_type: { type: "string", maxLength: 20 },
        breakage_type: { type: "string", maxLength: 50 },
      },
      required: [
        // "session_token",
        "address",
        "client_phone",
        "meeting_time",
        "brand",
        "product_type",
        "breakage_type",
      ],
    },
    "read-orders": {
      type: "object",
      properties: {
        // session_token: { type: "string" },
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      required: [
        // "session_token",
        "start",
        "limit",
      ],
    },
    "place-order": {
      type: "object",
      properties: {
        // session_token: { type: "string" },
        master_id: { type: "string" },
        order_id: { type: "string" },
      },
      required: [
        // "session_token",
        "master_id",
        "order_id",
      ],
    },
    "read-nassigned-order": {
      type: "object",
      properties: {
        // session_token: { type: "string" },
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      // required: [
      //   "session_token",
      //   "start",
      //   "limit",
      // ],
    },
  },
  admin: {
    "read-admins": {
      type: "object",
      properties: {
        session_token: { type: "string" },
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      required: ["session_token"],
    },
    "update-admin": {
      type: "object",
      properties: {
        session_token: { type: "string" },
        password: { type: "string" },
      },
      required: ["session_token", "password"],
    },
  },
  user: {
    "read-users": {
      type: "object",
      properties: {
        // session_token: { type: "string" },
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      // required: ["session_token"],
    },
    "read-new-user": {
      type: "object",
      properties: {
        // session_token: { type: "string" },
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      // required: ["session_token"],
    },
    "update-user": {
      type: "object",
      properties: {
        session_token: { type: "string" },
        password: { type: "string" },
      },
      required: ["session_token", "password"],
    },
    "reg-user": {
      type: "object",
      properties: {
        session_token: { type: "string" },
        password: { type: "string" },
      },
      required: ["session_token", "password"],
    },
  },
};
