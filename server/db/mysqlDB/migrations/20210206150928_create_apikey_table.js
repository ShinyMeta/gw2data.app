
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE apikeys (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    apikey VARCHAR(100) NOT NULL,
    account_name VARCHAR(45) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idapikeys_UNIQUE (id ASC) VISIBLE);
  `)
};

exports.down = function(knex) {
  return knex.schema.dropTable('apikeys')
};
