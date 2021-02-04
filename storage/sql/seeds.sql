-- SQLite
INSERT INTO users
  (id, first_name, last_name, email, active, role, createdAt, updatedAt)
VALUES
  ('897bd86c-feda-4c17-ab09-20959550899b', 'Admin', 'Adminovic', 'admin.adminovic@company.com', true, 'Admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('064615be-15ad-4e10-b06a-6cdc46fa8788', 'Joe', 'Doe', 'joe.doe@company.com', true, 'User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
