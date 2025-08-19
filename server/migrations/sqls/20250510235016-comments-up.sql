/* Replace with your SQL commands */
CREATE TABLE comments(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    text TEXT NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    file_url TEXT,
    file_type TEXT,
    shown BOOLEAN DEFAULT FALSE
)