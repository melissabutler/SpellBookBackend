CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    char_name TEXT NOT NULL,
    char_class TEXT NOT NULL,
    lvl INTEGER NOT NULL
);

CREATE TABLE userCharacters (
    char_id INTEGER 
        REFERENCES characters ON DELETE CASCADE,
    username VARCHAR(25)
        REFERENCES users ON DELETE CASCADE,
        PRIMARY KEY (char_id, username)
);

CREATE TABLE spellLists (
    id INTEGER 
        REFERENCES characters ON DELETE CASCADE,
    spell_idx TEXT
        REFERENCES spell_cards ON DELETE CASCADE
);

