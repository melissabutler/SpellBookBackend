\c spellBook

INSERT INTO users (username, password, email, is_admin)
VALUES  ('testuser',
        'password',
        'testuser@email.com', 
        TRUE),
        ('testuser2', 
        'password2', 
        'testuser2@email.com', 
        FALSE);

INSERT INTO spell_cards (idx, name, description, range, level)
VALUES ('acid-arrow', 'Acid Arrow', 'An acid arrow', '90 feet', 2),
        ('acid-spray', 'Acid Spray', 'a spary of acid', '30 ft cone', 3);

INSERT INTO characters (char_name, char_class, lvl)
VALUES ('char1', 
        'cleric', 
        1),
        ('char2', 'sorceror', 3);

INSERT INTO user_characters (char_id, username)
VALUES ('1', 'testuser'),
        ('2', 'testuser');

INSERT INTO spell_lists (char_id, spell_idx) 
VALUES (1, 'acid-arrow'),
        (1, 'acid-spray'),
        (2, 'acid-arrow');