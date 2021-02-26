
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(45) NOT NULL,
    passhash VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE,
    UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE);
  `)
};

exports.down = function(knex) {
  return knex.schema.dropTable('users')
};

/*
https://gist.github.com/NigelEarle/70db130cc040cc2868555b29a0278261
$ knex migrate:make create_users_table
$ knex migrate:latest
$ knex migrate:rollback
*/

