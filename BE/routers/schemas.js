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
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    logout: {
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    "change-password": {
      type: "object",
      properties: {
        password: { type: "string" },
      },
      required: ["password"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
  },
  order: {
    "create-order": {
      type: "object",
      properties: {
        address: { type: "string", maxLength: 100 },
        client_phone: { type: "string", maxLength: 20 },
        meeting_time: { type: "string", maxLength: 5 },
        brand: { type: "string", maxLength: 20 },
        product_type: { type: "string", maxLength: 20 },
        breakage_type: { type: "string", maxLength: 50 },
      },
      required: [
        "address",
        "client_phone",
        "meeting_time",
        "brand",
        "product_type",
        "breakage_type",
      ],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    "read-orders": {
      type: "object",
      properties: {
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      required: ["start", "limit"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    "place-order": {
      type: "object",
      properties: {
        master_id: { type: "string" },
        order_id: { type: "string" },
      },
      required: ["master_id", "order_id"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    "read-nassigned-order": {
      type: "object",
      properties: {
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      required: ["start", "limit"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
  },
  admin: {
    "read-admins": {
      type: "object",
      properties: {
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      required: ["start", "limit"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    "update-admin": {
      type: "object",
      properties: {
        password: { type: "string" },
      },
      required: ["password"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
  },
  user: {
    "read-users": {
      type: "object",
      properties: {
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      required: ["start", "limit"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    "read-new-user": {
      type: "object",
      properties: {
        start: { type: "integer" },
        limit: { type: "integer" },
      },
      required: ["start", "limit"],
      headers: {
        type: "object",
        properties: {
          Authorization: { type: "string" },
        },
        required: ["session_token"],
      },
    },
    // "update-user": {
    //   type: "object",
    //   properties: {
    //     password: { type: "string" },
    //   },
    //   required: ["password"],
    // },
    // "reg-user": {
    //   type: "object",
    //   properties: {
    //     password: { type: "string" },
    //   },
    //   required: ["password"],
    // },
  },
};
