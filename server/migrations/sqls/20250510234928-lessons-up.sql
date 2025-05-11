/* Replace with your SQL commands */
CREATE TABLE lessons (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    chapter_id uuid NOT NULL REFERENCES chapters (id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_paid BOOLEAN DEFAULT FALSE,
    price VARCHAR(200)
);