
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE data_records (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    gw2_account_name VARCHAR(45) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    status VARCHAR(45) NULL,
    description VARCHAR(200) NULL,
    details TEXT NULL,
    primary_tag VARCHAR(100) NULL,
    primary_element_id INT UNSIGNED NULL,
    primary_element_type VARCHAR(45) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);
  `)
};

exports.down = function(knex) {
  return knex.schema.dropTable('data_records')
};


