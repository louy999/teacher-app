/* Replace with your SQL commands */
CREATE TABLE trans_teacher(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid REFERENCES teachers (id),
    student_id uuid REFERENCES students (id),
    price VARCHAR(200)
);