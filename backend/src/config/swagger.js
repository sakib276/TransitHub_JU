import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJSDoc from "swagger-jsdoc";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

/**
 * OpenAPI definition generated from the ride-request route JSDoc annotations.
 *
 * @type {object}
 */
const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "TransitHub JU API",
    version: "1.0.0",
    description:
      "Backend API for campus locations, passenger queue requests, and driver assignments.",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "Backend health check" },
    { name: "Locations", description: "Active campus locations" },
    { name: "Drivers", description: "Driver availability and vehicles" },
    { name: "Ride requests", description: "Passenger queue entries and assignments" },
  ],
  components: {
    schemas: {
      Location: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "JU Gate" },
        },
      },
      RideRequest: {
        type: "object",
        required: [
          "id",
          "token",
          "passengerId",
          "pickupLocationId",
          "destinationLocationId",
          "seats",
          "position",
          "status",
        ],
        properties: {
          id: { type: "integer", example: 12 },
          token: { type: "string", example: "RQ-4d1f2a08c9ef113b" },
          passengerId: { type: "integer", example: 1 },
          passenger: { type: "string", example: "Passenger Name" },
          pickupLocationId: { type: "integer", example: 1 },
          pickup: { type: "string", example: "JU Gate" },
          destinationLocationId: { type: "integer", example: 2 },
          destination: { type: "string", example: "Central Library" },
          seats: { type: "integer", minimum: 1, maximum: 4, example: 2 },
          genderPreference: {
            type: "string",
            enum: ["Any", "Male", "Female"],
            example: "Any",
          },
          priority: { type: "boolean", example: false },
          position: { type: "integer", example: 1 },
          status: {
            type: "string",
            enum: ["Waiting", "Assigned", "Completed", "No-show", "Cancelled"],
            example: "Waiting",
          },
          joinedAt: { type: "string", format: "date-time" },
          driverId: { type: "integer", nullable: true, example: 4 },
          driver: { type: "string", nullable: true, example: "Driver Name" },
          vehicleId: { type: "integer", nullable: true, example: 1 },
        },
      },
      AvailableDriver: {
        type: "object",
        properties: {
          driverId: { type: "integer", example: 4 },
          name: { type: "string", example: "Driver One" },
          vehicleId: { type: "integer", example: 1 },
          vehicle: { type: "string", example: "Auto Rickshaw" },
          availableSeats: { type: "integer", example: 4 },
        },
      },
      DriverVehicle: {
        allOf: [
          { $ref: "#/components/schemas/AvailableDriver" },
          {
            type: "object",
            properties: {
              driverStatus: {
                type: "string",
                enum: ["Available", "Busy", "Busy & Full", "Offline"],
              },
            },
          },
        ],
      },
      Error: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Seat count must be an integer between 1 and 4." },
          code: { type: "string", example: "INVALID_SEAT_COUNT" },
        },
      },
      DataResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: { type: "array", items: {} },
        },
      },
      MessageResponse: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Ride request cancelled." },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    path.resolve(
      currentDirectory,
      "../features/ride-request/routes/ride-request-routes.js"
    ),
    path.resolve(currentDirectory, "../app.js"),
  ],
};

/**
 * Generated Swagger/OpenAPI document.
 *
 * @type {object}
 */
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
