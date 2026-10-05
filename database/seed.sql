USE transithub_ju;

-- Sample Locations (Stands)
INSERT INTO locations (name) VALUES
('JU Gate'),
('Central Library'),
('Business Studies'),
('Transport'),
('Botanical Garden'),
('Dairy Gate'),
('Prantik'),
('Faculty of Arts')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Users (Admin & Driver)
INSERT INTO users (name, email, phone, role, status) VALUES
('System Admin', 'admin@ju.ac.bd', '01710000001', 'admin', 'active'),
('Rahim Driver', 'rahim@ju.ac.bd', '01710000002', 'driver', 'active')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Vehicle linked to the driver
INSERT INTO vehicles (driver_id, plate_number, vehicle_type, capacity, available_seats, status, driver_status, current_location_id) 
VALUES 
(2, 'DHAKA-METRO-JU-101', 'Auto-Rickshaw', 4, 4, 'Active', 'Offline', 1)
ON DUPLICATE KEY UPDATE plate_number=plate_number;