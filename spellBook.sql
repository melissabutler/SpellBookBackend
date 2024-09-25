DROP DATABASE IF EXISTS spellBook;
CREATE DATABASE spellBook;

\c spellBook

DROP TABLE IF EXISTS spell_lists;
DROP TABLE IF EXISTS user_characters;

DROP TABLE IF EXISTS characters;



DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE characters (
    username VARCHAR(25) NOT NULL,
    id SERIAL PRIMARY KEY,
    char_name TEXT NOT NULL,
    char_class TEXT NOT NULL,
    lvl INTEGER NOT NULL,
    strength INTEGER CHECK (strength >= 0 AND strength <= 20),
    dexterity INTEGER CHECK (dexterity >= 0 AND  dexterity <= 20),
    constitution INTEGER CHECK ( constitution >= 0 AND constitution <= 20),
    intelligence INTEGER CHECK (intelligence >= 0 AND intelligence <= 20),
    wisdom INTEGER CHECK (wisdom >= 0 AND wisdom <= 20),
    charisma INTEGER CHECK (charisma >= 0 AND charisma <= 20)
    
);

CREATE TABLE user_characters (
    char_id INTEGER 
        REFERENCES characters ON DELETE CASCADE,
    username VARCHAR(25)
        REFERENCES users ON DELETE CASCADE,
        PRIMARY KEY (char_id, username)
);

CREATE TABLE spell_lists (
    char_id INTEGER 
        REFERENCES characters ON DELETE CASCADE,
    spell_idx TEXT
);


