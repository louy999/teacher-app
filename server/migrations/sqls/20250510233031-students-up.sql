/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE students (
    id uuid PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_pic VARCHAR(255) DEFAULT 'https://res.cloudinary.com/djtp5oepp/image/upload/v1774414268/teacher/ivxrdjwqivrug5svyglk.png',
    stage VARCHAR(50) NOT NULL
);