/* Replace with your SQL commands */
CREATE TABLE notifications(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid NOT NULL REFERENCES teachers (id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    stage VARCHAR(100) NOT NULL
);