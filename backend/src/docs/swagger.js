const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description: "REST API documentation for the E-Commerce backend."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          isAdmin: { type: "boolean" }
        }
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          stock: { type: "integer" },
          category: { $ref: "#/components/schemas/Category" }
        }
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" }
        }
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          quantity: { type: "integer" },
          unitPrice: { type: "number" },
          totalPrice: { type: "number" },
          product: { $ref: "#/components/schemas/Product" }
        }
      },
      Cart: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          status: { type: "string" },
          subtotal: { type: "number" },
          total: { type: "number" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" }
          }
        }
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          status: { type: "string" },
          subtotal: { type: "number" },
          tax: { type: "number" },
          total: { type: "number" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product: { $ref: "#/components/schemas/Product" },
                quantity: { type: "integer" },
                unitPrice: { type: "number" },
                totalPrice: { type: "number" }
              }
            }
          }
        }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Invalidate current access token",
        security: [{ bearerAuth: [] }],
        responses: {
          204: {
            description: "Logout successful"
          },
          401: {
            description: "Unauthorized"
          }
        }
      }
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Authentication success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Current user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          }
        }
      }
    },
    "/api/v1/products": {
      get: {
        tags: ["Products"],
        summary: "List products",
        parameters: [
          { in: "query", name: "search", schema: { type: "string" } },
          { in: "query", name: "cat", schema: { type: "string", format: "uuid" } },
          { in: "query", name: "sort", schema: { type: "string" } },
          { in: "query", name: "order", schema: { type: "string" } },
          { in: "query", name: "page", schema: { type: "integer" } },
          { in: "query", name: "limit", schema: { type: "integer" } }
        ],
        responses: {
          200: {
            description: "Paginated products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" }
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        pageCount: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Create a product",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "price", "categoryId"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock: { type: "integer" },
                  categoryId: { type: "string", format: "uuid" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Product created" }
        }
      }
    },
    "/api/v1/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get a single product",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: {
          200: {
            description: "Product detail",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Products"],
        summary: "Update a product",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock: { type: "integer" },
                  categoryId: { type: "string", format: "uuid" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Product updated" }
        }
      },
      delete: {
        tags: ["Products"],
        summary: "Soft delete a product",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: {
          200: { description: "Product soft-deleted" }
        }
      }
    },
    "/api/v1/categories": {
      get: {
        tags: ["Categories"],
        summary: "List categories",
        responses: {
          200: { description: "Category list" }
        }
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Category created" }
        }
      }
    },
    "/api/v1/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get category",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: { 200: { description: "Category" } }
      },
      put: {
        tags: ["Categories"],
        summary: "Update category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Category updated" } }
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: { 200: { description: "Category deleted" } }
      }
    },
    "/api/v1/carts": {
      get: {
        tags: ["Cart"],
        summary: "Get active cart",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Active cart",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Cart" }
              }
            }
          }
        }
      }
    },
    "/api/v1/carts/items": {
      post: {
        tags: ["Cart"],
        summary: "Add/Update cart item",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["product_id", "qty"],
                properties: {
                  product_id: { type: "string", format: "uuid" },
                  qty: { type: "integer" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Cart updated" } }
      }
    },
    "/api/v1/carts/items/{productId}": {
      delete: {
        tags: ["Cart"],
        summary: "Remove cart item",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "productId",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: { 200: { description: "Cart item removed" } }
      }
    },
    "/api/v1/carts/checkout": {
      post: {
        tags: ["Cart"],
        summary: "Checkout cart",
        security: [{ bearerAuth: [] }],
        responses: {
          201: {
            description: "Order created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    order_id: { type: "string", format: "uuid" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/orders": {
      get: {
        tags: ["Orders"],
        summary: "List current user orders",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Orders list" }
        }
      }
    },
    "/api/v1/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order detail",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: { 200: { description: "Order detail" } }
      },
      patch: {
        tags: ["Orders"],
        summary: "Update order status (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string" }
                }
              }
            }
          }
        },
        responses: { 200: { description: "Order updated" } }
      }
    },
    "/api/v1/admin/metrics": {
      get: {
        tags: ["Admin"],
        summary: "Get platform metrics",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Metrics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalSales: { type: "number" },
                    productCount: { type: "integer" },
                    activeUsers: { type: "integer" },
                    ordersByStatus: {
                      type: "object",
                      additionalProperties: { type: "integer" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/admin/orders": {
      get: {
        tags: ["Admin"],
        summary: "List orders (admin)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Orders" } }
      }
    },
    "/api/v1/admin/orders/{id}": {
      get: {
        tags: ["Admin"],
        summary: "Get order (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" }
          }
        ],
        responses: { 200: { description: "Order" } }
      }
    }
  }
};

module.exports = swaggerDocument;
