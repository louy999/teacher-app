CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE teachers (
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id uuid PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    grade_levels TEXT [],
    profile_pic VARCHAR(255) DEFAULT 'blank-profile-.png',
    paid BOOLEAN DEFAULT FALSE,
    price VARCHAR(100),
    expire_date TIMESTAMP
);