/* Replace with your SQL commands */
CREATE TABLE views (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lesson_id uuid NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    progress VARCHAR(200) DEFAULT '0%'
);