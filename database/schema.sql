-- TransitHub_JU Database Schema: Complaints Feature

CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(36) NOT NULL UNIQUE,
    passenger_id VARCHAR(50) NOT NULL,
    category ENUM('DRIVER', 'SERVICE', 'RIDE') NOT NULL,
    related_ride_id VARCHAR(50) NULL,
    description TEXT NOT NULL,
    status ENUM('UNDER_REVIEW', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'UNDER_REVIEW',
    admin_notes TEXT NULL,
    reviewed_by VARCHAR(50) NULL,
    reviewed_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_passenger (passenger_id),
    INDEX idx_status (status),
    INDEX idx_complaint_id (complaint_id)
);

