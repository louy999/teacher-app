/* Replace with your SQL commands */
CREATE TABLE replay(
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment_id uuid DEFAULT NULL REFERENCES comments (id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    text TEXT NOT NULL,
    file_url TEXT,
    file_type TEXT
)