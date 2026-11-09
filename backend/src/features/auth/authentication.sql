-- Apply after the authoritative transithub_ju.sql schema has created users.
-- This companion table keeps auth counters/challenges out of shared business tables.
CREATE TABLE IF NOT EXISTS auth_security (
  user_id INT NOT NULL PRIMARY KEY,
  password_failures TINYINT UNSIGNED NOT NULL DEFAULT 0,
  password_locked_until DATETIME NULL,
  otp_failures TINYINT UNSIGNED NOT NULL DEFAULT 0,
  otp_locked_until DATETIME NULL,
  otp_hash CHAR(60) NULL,
  otp_expires_at DATETIME NULL,
  otp_sent_at DATETIME NULL,
  reset_token_hash CHAR(64) NULL,
  reset_expires_at DATETIME NULL,
  CONSTRAINT fk_auth_security_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Driver registration collects these fields before a vehicle has been assigned.
CREATE TABLE IF NOT EXISTS driver_applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  license_number VARCHAR(50) NOT NULL,
  requested_vehicle_type VARCHAR(50) NOT NULL,
  status ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_driver_application_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
