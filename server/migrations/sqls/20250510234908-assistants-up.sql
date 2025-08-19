/* Replace with your SQL commands */
CREATE TABLE assistants (
    id uuid PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
    profile_pic VARCHAR(255) DEFAULT 'blank-profile-.png',
    access Text [] NOT NULL
);