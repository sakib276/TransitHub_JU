CREATE DATABASE IF NOT EXISTS transithub_ju;

USE transithub_ju;

-- =========================================================
-- 1. LOCATIONS
-- Fixed pickup and destination points inside JU.
-- =========================================================

CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL UNIQUE,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- 2. USERS
-- Passenger, Driver and Admin are represented by roles.
-- =========================================================

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE,

    phone VARCHAR(20) UNIQUE,

    password_hash VARCHAR(255),

    role ENUM('passenger', 'driver', 'admin') NOT NULL,

    status ENUM('active', 'inactive') DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. VEHICLES
-- Each driver is associated with one vehicle at a time.
-- =========================================================

CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,

    driver_id INT UNIQUE,

    plate_number VARCHAR(30) NOT NULL UNIQUE,

    vehicle_type VARCHAR(50) NOT NULL,

    capacity INT NOT NULL,

    available_seats INT NOT NULL,

    -- FR-7.2: Administrator/Fleet Status
    status ENUM(
        'Active',
        'Under Maintenance',
        'Inactive'
    ) DEFAULT 'Active',

    -- FR-7.1: Driver Real-time Operational Status
    driver_status ENUM(
        'Available',
        'Busy',
        'Busy & Full',
        'Offline'
    ) DEFAULT 'Offline',

    -- FR-7.1: Current Stand (when Available or starting route)
    current_location_id INT NULL,

    -- FR-7.1: Route Destination (when Busy)
    destination_location_id INT NULL,

    -- Tracks last status change timestamp
    status_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (driver_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    FOREIGN KEY (current_location_id)
        REFERENCES locations(id)
        ON DELETE SET NULL,

    FOREIGN KEY (destination_location_id)
        REFERENCES locations(id)
        ON DELETE SET NULL
);

-- =========================================================
-- 4. QUEUE ENTRIES
-- Stores passengers waiting in the queue.
-- =========================================================

CREATE TABLE queue_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,

    passenger_id INT NOT NULL,

    token VARCHAR(20) NOT NULL UNIQUE,

    pickup_location_id INT NOT NULL,

    destination_location_id INT NOT NULL,

    seats_needed INT NOT NULL,

    gender_preference ENUM(
        'Any',
        'Male',
        'Female'
    ) DEFAULT 'Any',

    priority BOOLEAN DEFAULT FALSE,

    position INT NOT NULL,

    status ENUM(
        'Waiting',
        'Assigned',
        'Completed',
        'No-show',
        'Cancelled'
    ) DEFAULT 'Waiting',

    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (passenger_id)
        REFERENCES users(id),

    FOREIGN KEY (pickup_location_id)
        REFERENCES locations(id),

    FOREIGN KEY (destination_location_id)
        REFERENCES locations(id),

    CHECK (seats_needed >= 1 AND seats_needed <= 4)
);


-- =========================================================
-- 5. PRIORITY REQUESTS
-- Stores medical/academic emergency priority requests.
-- =========================================================

CREATE TABLE priority_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,

    queue_entry_id INT NOT NULL,

    passenger_id INT NOT NULL,

    reason ENUM(
        'Medical emergency',
        'Academic emergency',
        'Other'
    ) NOT NULL,

    proof_path VARCHAR(255),

    status ENUM(
        'Pending',
        'Approved',
        'Rejected'
    ) DEFAULT 'Pending',

    review_reason TEXT,

    reviewed_by INT NULL,

    reviewed_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (queue_entry_id)
        REFERENCES queue_entries(id)
        ON DELETE CASCADE,

    FOREIGN KEY (passenger_id)
        REFERENCES users(id),

    FOREIGN KEY (reviewed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- =========================================================
-- 6. QUEUE ASSIGNMENTS
-- Records when a driver assigns seats to a queued passenger.
-- =========================================================

CREATE TABLE queue_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,

    queue_entry_id INT NOT NULL,

    driver_id INT NOT NULL,

    vehicle_id INT NOT NULL,

    seats_assigned INT NOT NULL,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (queue_entry_id)
        REFERENCES queue_entries(id),

    FOREIGN KEY (driver_id)
        REFERENCES users(id),

    FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id),

    CHECK (seats_assigned >= 1)
);

-- =========================================================
-- 7. QUEUE REJECTIONS
-- Stores per-driver declines without cancelling a passenger's request.
-- =========================================================

CREATE TABLE queue_rejections (
    queue_entry_id INT NOT NULL,

    driver_id INT NOT NULL,

    rejected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (queue_entry_id, driver_id),

    FOREIGN KEY (queue_entry_id)
        REFERENCES queue_entries(id)
        ON DELETE CASCADE,

    FOREIGN KEY (driver_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- SAMPLE JU LOCATIONS
-- =========================================================

INSERT INTO locations (name) VALUES
('JU Gate'),
('Central Library'),
('Business Studies'),
('Transport'),
('Botanical Garden'),
('Dairy Gate'),
('Prantik'),
('Faculty of Arts');
