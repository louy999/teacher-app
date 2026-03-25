CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE teachers (
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id uuid PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    grade_levels TEXT [],
    profile_pic VARCHAR(255) DEFAULT 'https://res.cloudinary.com/djtp5oepp/image/upload/v1774414268/teacher/ivxrdjwqivrug5svyglk.png'
);