
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE custom_tags (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);
  `)
};

exports.down = function(knex) {
  return knex.schema.dropTable('custom_tags')
};


