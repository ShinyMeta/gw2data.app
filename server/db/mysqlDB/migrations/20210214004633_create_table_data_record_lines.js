
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE data_record_lines (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    data_record_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    element_id INT UNSIGNED NOT NULL,
    element_type VARCHAR(45) NOT NULL,
    upgrades VARCHAR(100) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);
  `)
};

exports.down = function(knex) {
  return knex.schema.dropTable('data_record_lines')
};



