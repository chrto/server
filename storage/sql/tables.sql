-- SQLite
CREATE TABLE IF NOT EXISTS users (
    `id` UUID PRIMARY KEY NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `active` TINYINT(1) NOT NULL DEFAULT 1,
    `role` VARCHAR(10) NOT NULL DEFAULT 'User' check (role in ('Admin', 'User')),
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    constraint uq_users_email UNIQUE (email)
);
