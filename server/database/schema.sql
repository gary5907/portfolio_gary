CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE projets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link VARCHAR(255),
  image_url VARCHAR(255),
  users_id INT,
  FOREIGN KEY (users_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255)
);

CREATE TABLE projets_skills (
  projets_id INT NOT NULL,
  skills_id INT NOT NULL,
  PRIMARY KEY (projets_id, skills_id),
  FOREIGN KEY (projets_id) REFERENCES projets(id) ON DELETE CASCADE,
  FOREIGN KEY (skills_id) REFERENCES skills(id) ON DELETE CASCADE
);