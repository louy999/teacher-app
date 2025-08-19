/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE students (
    id uuid PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_pic VARCHAR(255) DEFAULT 'blank-profile-.png',
    stage VARCHAR(50) NOT NULL
);