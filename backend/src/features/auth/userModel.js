const { DataTypes } = require("sequelize");

const sequelize = require("../../config/database");

/**
 * Represents a TransitHub_JU user.
 *
 * @module userModel
 */
const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id",
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "full_name",
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "email",
    },

    studentId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "student_id",
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "phone",
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },

    role: {
      type: DataTypes.ENUM("Passenger", "Driver", "Admin"),
      allowNull: false,
      field: "role",
    },

    profilePhoto: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "profile_photo",
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;