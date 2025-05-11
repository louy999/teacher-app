/* Replace with your SQL commands */
CREATE TABLE subscribe(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_id uuid NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    lesson_id uuid NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    expire TEXT NOT NULL,
    price VARCHAR(200)
)