/* Replace with your SQL commands */
CREATE TABLE questions (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exams_id uuid NOT NULL REFERENCES exams (id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answers TEXT [] NOT NULL,
    correct_answer TEXT NOT NULL,
    time TEXT NOT NULL,
    notes TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL
);