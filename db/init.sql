CREATE DATABASE qa_assessment;
\c qa_assessment

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE,
    service VARCHAR(50),
    paid_until TIMESTAMP
);

INSERT INTO users (uuid, service, paid_until) VALUES
('test-user-uuid', 'law', NOW() + INTERVAL '30 days'),
('test-user-uuid', 'ot', NOW() + INTERVAL '30 days'),
('test-user-uuid', 'pb', NOW() + INTERVAL '30 days');