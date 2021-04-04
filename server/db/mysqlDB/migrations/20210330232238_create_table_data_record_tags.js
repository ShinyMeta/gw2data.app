
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE data_record_tags (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    data_record_id INT UNSIGNED NOT NULL,
    name VARCHAR(45) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);
  `)
};

exports.down = function(knex) {
  return knex.schema.dropTable('data_record_tags')
};


