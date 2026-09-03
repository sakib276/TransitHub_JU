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
    queue_entry_id: DataTypes.INTEGER,
    driver_id: DataTypes.INTEGER,
    vehicle_id: DataTypes.INTEGER,
    seats_assigned: DataTypes.INTEGER,
    assigned_at: DataTypes.DATE,
  },
  {
    tableName: "queue_assignments",
    timestamps: false,
  }
);

export default QueueAssignment;