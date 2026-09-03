
import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const PriorityRequest = sequelize.define(
  "PriorityRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    queue_entry_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    passenger_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    proof_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },

    review_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    reviewed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "priority_requests",
    timestamps: false,
  }
);

export default PriorityRequest;
