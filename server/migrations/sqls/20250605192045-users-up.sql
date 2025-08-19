/* Replace with your SQL commands */
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (
        role IN (
            'teachers',
            'students',
            'parents',
            'assistants',
            'centers'
        )
    ) NOT NULL
);