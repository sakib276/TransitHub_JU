import { DataTypes } from "sequelize";
import sequelize from "../../../config/database.js";

const QueueEntry = sequelize.define(
  "QueueEntry",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    passenger_id: DataTypes.INTEGER,
    token: DataTypes.STRING,
    pickup_location_id: DataTypes.INTEGER,
    destination_location_id: DataTypes.INTEGER,
    seats_needed: DataTypes.INTEGER,
    gender_preference: DataTypes.ENUM("Any", "Male", "Female"),
    priority: DataTypes.BOOLEAN,
    position: DataTypes.INTEGER,
    status: DataTypes.ENUM(
      "Waiting",
      "Assigned",
      "Completed",
      "No-show",
      "Cancelled"
    ),
    joined_at: DataTypes.DATE,
  },
  {
    tableName: "queue_entries",
    timestamps: false,
  }
);

export default QueueEntry;