/* Replace with your SQL commands */
CREATE TABLE parents (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    profile_pic VARCHAR(255),
    access_level VARCHAR(50) DEFAULT 'parent'
);