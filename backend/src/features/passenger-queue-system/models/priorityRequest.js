import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const PriorityRequest = sequelize.define(
  "PriorityRequest",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    queue_entry_id: DataTypes.INTEGER,
    passenger_id: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    proof_path: DataTypes.STRING,
    status: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    review_reason: DataTypes.TEXT,
    reviewed_by: DataTypes.INTEGER,
    reviewed_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
  },
  {
    tableName: "priority_requests",
    timestamps: false,
  }
);

export default PriorityRequest;