/* Replace with your SQL commands */
CREATE TABLE teachers_assistants (
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
    assistant_id uuid REFERENCES assistants(id) ON DELETE CASCADE
);