DROP DATABASE IF EXISTS `example-ts-poo`;
CREATE DATABASE `example-ts-poo`;

USE `example-ts-poo`;

CREATE TABLE `Users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `displayName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `photoURL` TEXT NULL
);