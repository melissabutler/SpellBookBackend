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
VALUES ('acid-arrow', 'Acid Arrow', 'An acid arrow', '90 feet', 2);

INSERT INTO characters (char_name, char_class, lvl)
VALUES ('char1', 
        'cleric', 
        1),
        ('char2', 'sorceror', 3);

INSERT INTO userCharacters (char_id, username)
VALUES ('1', 'testuser'),
        ('2', 'testuser');

INSERT INTO spellLists (id, spell_idx) 
VALUES (1, 'acid-arrow')