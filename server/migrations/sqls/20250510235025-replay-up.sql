/* Replace with your SQL commands */
CREATE TABLE replay(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment_id uuid DEFAULT NULL REFERENCES comments (id) ON DELETE CASCADE,
    assistant_id uuid NOT NULL REFERENCES assistants (id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES students (id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    file_url TEXT,
    file_type TEXT,
    shown BOOLEAN DEFAULT FALSE
)