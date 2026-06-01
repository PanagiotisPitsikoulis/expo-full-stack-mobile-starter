CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  external_id VARCHAR(190),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theatres (
  theatre_id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  location VARCHAR(160) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS shows (
  show_id VARCHAR(36) PRIMARY KEY,
  theatre_id VARCHAR(36) NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  duration INT NOT NULL,
  age_rating VARCHAR(20) NOT NULL,
  FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

CREATE TABLE IF NOT EXISTS showtimes (
  showtime_id VARCHAR(36) PRIMARY KEY,
  show_id VARCHAR(36) NOT NULL,
  starts_at DATETIME NOT NULL,
  hall VARCHAR(120) NOT NULL,
  base_price DECIMAL(8, 2) NOT NULL,
  FOREIGN KEY (show_id) REFERENCES shows(show_id),
  INDEX idx_showtimes_show_date (show_id, starts_at)
);

CREATE TABLE IF NOT EXISTS seats (
  seat_id VARCHAR(80) PRIMARY KEY,
  showtime_id VARCHAR(36) NOT NULL,
  seat_code VARCHAR(20) NOT NULL,
  row_label VARCHAR(20) NOT NULL,
  category VARCHAR(40) NOT NULL,
  price DECIMAL(8, 2) NOT NULL,
  FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id),
  UNIQUE KEY uniq_showtime_seat_code (showtime_id, seat_code)
);

CREATE TABLE IF NOT EXISTS reservations (
  reservation_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  showtime_id VARCHAR(36) NOT NULL,
  status ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  total_cost DECIMAL(8, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (showtime_id) REFERENCES showtimes(showtime_id),
  INDEX idx_reservations_user (user_id, created_at)
);

CREATE TABLE IF NOT EXISTS reservation_seats (
  reservation_id VARCHAR(36) NOT NULL,
  seat_id VARCHAR(80) NOT NULL,
  PRIMARY KEY (reservation_id, seat_id),
  FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
  FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

INSERT IGNORE INTO theatres (theatre_id, name, location, description) VALUES
  ('theatre-1', 'Apollo Theatre', 'Athens', 'Historic city theatre for classic and modern productions.'),
  ('theatre-2', 'Piraeus Stage', 'Piraeus', 'Compact venue with evening comedy and drama shows.');

INSERT IGNORE INTO shows (show_id, theatre_id, title, description, duration, age_rating) VALUES
  ('show-1', 'theatre-1', 'Antigone', 'A contemporary staging of Sophocles tragedy.', 95, '12+'),
  ('show-2', 'theatre-2', 'The Comedy Night', 'A fast-paced theatre comedy in two acts.', 80, 'All');

INSERT IGNORE INTO showtimes (showtime_id, show_id, starts_at, hall, base_price) VALUES
  ('showtime-1', 'show-1', '2026-06-05 20:30:00', 'Main Hall', 18.00),
  ('showtime-2', 'show-2', '2026-06-06 19:00:00', 'Stage B', 14.00);

INSERT IGNORE INTO seats (seat_id, showtime_id, seat_code, row_label, category, price) VALUES
  ('showtime-1-A1', 'showtime-1', 'A1', 'A', 'premium', 24.00),
  ('showtime-1-A2', 'showtime-1', 'A2', 'A', 'premium', 24.00),
  ('showtime-1-A3', 'showtime-1', 'A3', 'A', 'premium', 24.00),
  ('showtime-1-B1', 'showtime-1', 'B1', 'B', 'standard', 18.00),
  ('showtime-1-B2', 'showtime-1', 'B2', 'B', 'standard', 18.00),
  ('showtime-1-B3', 'showtime-1', 'B3', 'B', 'standard', 18.00),
  ('showtime-2-A1', 'showtime-2', 'A1', 'A', 'premium', 20.00),
  ('showtime-2-A2', 'showtime-2', 'A2', 'A', 'premium', 20.00),
  ('showtime-2-B1', 'showtime-2', 'B1', 'B', 'standard', 14.00),
  ('showtime-2-B2', 'showtime-2', 'B2', 'B', 'standard', 14.00);
