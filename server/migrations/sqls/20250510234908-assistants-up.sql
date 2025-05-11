/* Replace with your SQL commands */
CREATE TABLE assistants (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    profile_picture VARCHAR(200),
    access_level VARCHAR(50) DEFAULT 'assistant',
    access_type VARCHAR(50) NOT NULL
);