-- TransitHub_JU Database Schema
-- Based on Database Schema doc (Revised) and SRS v3.

-- 1. Users
CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  student_id VARCHAR(20) NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Passenger', 'Driver', 'Admin') NOT NULL,
  profile_photo VARCHAR(255) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles
CREATE TABLE Vehicles (
  vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type ENUM('Rickshaw', 'Cart') NOT NULL,
  color VARCHAR(30) NULL,
  total_seats INT NOT NULL,
  admin_status ENUM('Active', 'Under Maintenance', 'Inactive') DEFAULT 'Active'
);

-- 3. Drivers
CREATE TABLE Drivers (
  driver_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  assigned_vehicle_id INT NULL,
  driver_status ENUM('Available', 'Busy') DEFAULT 'Available',
  current_stand VARCHAR(100) NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (assigned_vehicle_id) REFERENCES Vehicles(vehicle_id)
);

-- 4. Routes
CREATE TABLE Routes (
  route_id INT PRIMARY KEY AUTO_INCREMENT,
  route_name VARCHAR(100) NOT NULL,
  start_point VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  estimated_time INT
);

-- 5. Stops
CREATE TABLE Stops (
  stop_id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT NOT NULL,
  stop_name VARCHAR(100) NOT NULL,
  stop_order INT NOT NULL,
  FOREIGN KEY (route_id) REFERENCES Routes(route_id)
);

-- 6. Ride Requests
CREATE TABLE RideRequests (
  request_id INT PRIMARY KEY AUTO_INCREMENT,
  passenger_id INT NOT NULL,
  pickup_stop_id INT NOT NULL,
  drop_stop_id INT NOT NULL,
  seat_count INT NOT NULL,
  request_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  driver_id INT NULL,
  trip_id INT NULL,
  status ENUM('Pending', 'Accepted', 'Rejected', 'Cancelled', 'Expired') DEFAULT 'Pending',
  FOREIGN KEY (passenger_id) REFERENCES Users(user_id),
  FOREIGN KEY (pickup_stop_id) REFERENCES Stops(stop_id),
  FOREIGN KEY (drop_stop_id) REFERENCES Stops(stop_id),
  FOREIGN KEY (driver_id) REFERENCES Drivers(driver_id)
);

-- 7. Passenger Queue
CREATE TABLE PassengerQueue (
  queue_id INT PRIMARY KEY AUTO_INCREMENT,
  request_id INT NOT NULL,
  queue_number INT NOT NULL,
  priority ENUM('Normal', 'Emergency') DEFAULT 'Normal',
  priority_status ENUM('Not Requested', 'Pending', 'Approved', 'Rejected') DEFAULT 'Not Requested',
  proof_document VARCHAR(255) NULL,
  queue_status ENUM('Waiting', 'Boarded', 'Skipped') DEFAULT 'Waiting',
  FOREIGN KEY (request_id) REFERENCES RideRequests(request_id)
);

-- 8. Shared Rides
CREATE TABLE SharedRides (
  shared_ride_id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT NOT NULL,
  passenger_id INT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  seat_number INT NULL,
  status ENUM('Active', 'Cancelled', 'No-show') DEFAULT 'Active',
  FOREIGN KEY (passenger_id) REFERENCES Users(user_id)
);

-- 9. Fare
CREATE TABLE Fare (
  fare_id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT NOT NULL,
  amount DECIMAL(5, 2) NOT NULL,
  FOREIGN KEY (route_id) REFERENCES Routes(route_id)
);

-- 10. Trip History
CREATE TABLE TripHistory (
  history_id INT PRIMARY KEY AUTO_INCREMENT,
  passenger_id INT NOT NULL,
  trip_id INT NOT NULL,
  ride_type ENUM('Private', 'Shared', 'Queue', 'Emergency') NOT NULL,
  fare_paid DECIMAL(5, 2),
  completed_at DATETIME,
  FOREIGN KEY (passenger_id) REFERENCES Users(user_id)
);

-- 11. Complaints
CREATE TABLE Complaints (
  complaint_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  trip_id INT NULL,
  subject VARCHAR(150) NOT NULL,
  description TEXT,
  status ENUM('Pending', 'Under Review', 'Resolved', 'Dismissed') DEFAULT 'Pending',
  resolution_notes TEXT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 12. Notifications
CREATE TABLE Notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 13. Emergency Reports
CREATE TABLE EmergencyReports (
  emergency_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  trip_id INT NOT NULL,
  location VARCHAR(150) NULL,
  description TEXT,
  status ENUM('Reported', 'Responding', 'Resolved') DEFAULT 'Reported',
  reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 14. Audit Logs
CREATE TABLE AuditLogs (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  target_table VARCHAR(50),
  target_id INT,
  description TEXT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);

-- 15. OTP Codes
CREATE TABLE OtpCodes (
  otp_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  code VARCHAR(10) NOT NULL,
  purpose ENUM('Login', 'Password Reset') NOT NULL,
  expires_at DATETIME NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
