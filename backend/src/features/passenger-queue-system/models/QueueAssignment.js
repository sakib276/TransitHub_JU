
import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const QueueAssignment = sequelize.define(
  "QueueAssignment",
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

    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seats_assigned: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "queue_assignments",
    timestamps: false,
  }
);

export default QueueAssignment;
