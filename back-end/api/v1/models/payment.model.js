const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database.js");

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    order_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
status: {
        type: DataTypes.ENUM("pending", "success", "failed"),
        defaultValue: "pending",
      },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    result_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    message: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    pay_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    extra_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

Payment.beforeUpdate((payment) => {
  payment.setDataValue("updated_at", new Date());
});

Payment.associate = (models) => {
  Payment.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });
};

module.exports = Payment;
