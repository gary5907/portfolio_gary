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
  image_url VARCHAR(255),
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255)
);

CREATE TABLE projets_skill (
  projet_id INT NOT NULL,
  skill_id INT NOT NULL,
  PRIMARY KEY (projet_id, skill_id),
  FOREIGN KEY (projet_id) REFERENCES projets(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

INSERT INTO user (firstname, lastname, email, password) VALUES
('Gary', 'Gras', 'gary@example.com', '$argon2id$v=19$m=19456,t=2,p=1$0B02e2YJ4FRqfzMXoX8FIg$jrf0F5/9oUupOvpmqNKkUh64wPXC5fNwLYJ1o88aQMs');

INSERT INTO skills (name, image_url) VALUES
('React', '/src/assets/image/reactjs.svg'),
('JavaScript', '/src/assets/image/javascript.svg'),
('HTML5', '/src/assets/image/html5.svg'),
('CSS3', '/src/assets/image/css3.svg'),
('Node.js', '/src/assets/image/nodejs.svg'),
('Express', '/src/assets/image/express.svg'),
('MySQL', '/src/assets/image/mysql.svg'),
('Git', '/src/assets/image/git.svg'),
('GitHub', '/src/assets/image/github.svg');

INSERT INTO projets (title, description, image_url, user_id) VALUES
('Eating Nam Nam', 'Un projet fait en collaboration avec d\'autres développeurs pour créer des recettes uniques.', '/src/assets/image/eatDesk.png', 1),
('CodexArt', 'Une application pour le développement de la culture artistique.', '/src/assets/image/codeMob.png', 1);

INSERT INTO projets_skill (projet_id, skill_id) VALUES
(1, 1),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(2, 1),
(2, 4),
(2, 5),
(2, 8),
(2, 9);
