USE transithub_ju;

CREATE TABLE IF NOT EXISTS queue_rejections (
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
