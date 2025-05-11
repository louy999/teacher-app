/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE students (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    profile_pic VARCHAR(255),
    stage VARCHAR(50) NOT NULL,
    access_level VARCHAR(50) DEFAULT 'student'
);