/* Replace with your SQL commands */
CREATE TABLE teacher_subscriptions (
    id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid NOT NULL REFERENCES teachers (id) ON DELETE CASCADE UNIQUE,
    expire_date TIMESTAMP NOT NULL,
    plan VARCHAR(100),
    price VARCHAR(200),
    active BOOLEAN DEFAULT FALSE
);