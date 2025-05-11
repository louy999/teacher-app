/* Replace with your SQL commands */
CREATE TABLE answers (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    student_id uuid NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    question_id uuid NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    answer TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    marks TEXT NOT NULL
);