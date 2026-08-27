-- Sample seed data for TransitHub_JU
-- Covers Users, Vehicles, Drivers, Routes, Stops, and a ride request
-- so the "view assigned driver" feature (FR-11.1) has something to show.

INSERT INTO Users (full_name, email, student_id, phone, password_hash, role, profile_photo) VALUES
('Rafiq Islam', 'rafiq.passenger@juniv.edu', '2018-33-01', '01711111111', 'hashed_password_1', 'Passenger', NULL),
('Karim Mia', 'karim.driver@juniv.edu', NULL, '01722222222', 'hashed_password_2', 'Driver', 'karim.jpg');

INSERT INTO Vehicles (vehicle_number, vehicle_type, color, total_seats, admin_status) VALUES
('JU-RIK-101', 'Rickshaw', 'Green', 4, 'Active');

INSERT INTO Drivers (user_id, license_number, assigned_vehicle_id, driver_status, current_stand) VALUES
(2, 'DL-556677', 1, 'Busy', 'Main Gate');

INSERT INTO Routes (route_name, start_point, destination, estimated_time) VALUES
('Main Gate to CSE', 'Main Gate', 'CSE Building', 10);

INSERT INTO Stops (route_id, stop_name, stop_order) VALUES
(1, 'Main Gate', 1),
(1, 'CSE Building', 2);

INSERT INTO RideRequests (passenger_id, pickup_stop_id, drop_stop_id, seat_count, driver_id, status) VALUES
(1, 1, 2, 1, 1, 'Accepted');
