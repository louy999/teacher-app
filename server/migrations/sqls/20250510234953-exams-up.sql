/* Replace with your SQL commands */
CREATE TABLE exams(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    time TEXT NOT NULL,
    lesson_id uuid NOT NULL REFERENCES lessons (id) ON DELETE CASCADE
)