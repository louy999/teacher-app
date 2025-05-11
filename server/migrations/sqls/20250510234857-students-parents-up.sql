/* Replace with your SQL commands */
CREATE TABLE parents_students (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_id uuid NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    parent_id uuid NOT NULL REFERENCES parents (id) ON DELETE CASCADE
);