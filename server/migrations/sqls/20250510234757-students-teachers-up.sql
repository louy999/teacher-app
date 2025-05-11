/* Replace with your SQL commands */
create TABLE students_teachers (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_id uuid NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    teacher_id uuid NOT NULL REFERENCES teachers (id) ON DELETE CASCADE
);