CREATE DATABASE IF NOT EXISTS `raci_db`;
USE `raci_db`;
CREATE TABLE IF NOT EXISTS board_state (
  id INT PRIMARY KEY,
  payload JSON
);
INSERT INTO board_state (id, payload)
VALUES (1, JSON_OBJECT('tasks', JSON_ARRAY(), 'people', JSON_ARRAY(), 'statuses', JSON_ARRAY(), 'columns', JSON_ARRAY()))
ON DUPLICATE KEY UPDATE id = id;
