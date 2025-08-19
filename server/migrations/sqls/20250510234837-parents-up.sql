/* Replace with your SQL commands */
CREATE TABLE parents (
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id uuid PRIMARY KEY,
    profile_pic VARCHAR(255) DEFAULT 'blank-profile-.png'
);