/* Replace with your SQL commands */
CREATE TABLE chapters (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    stage TEXT NOT NULL
);