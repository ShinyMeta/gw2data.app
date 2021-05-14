
exports.up = function(knex, Promise) {
  return knex.raw(`
  CREATE TABLE summary_reports (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    name VARCHAR(60) NOT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    element_id INT NOT NULL,
    element_type VARCHAR(45) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);
    `)
  // .then (() => {
  //   return knex.raw(`
  //   CREATE TABLE summary_report_elements (
  //     id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  //     report_id INT UNSIGNED NOT NULL,
  //     element_id INT NOT NULL,
  //     element_type VARCHAR(45) NOT NULL,
  //     PRIMARY KEY (id),
  //     UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);
  //     `)
  // })
  .then (() => {
    return knex.raw(`
    CREATE TABLE summary_report_tags (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      report_id INT UNSIGNED NOT NULL,
      name VARCHAR(60) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE);
      `)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('summary_reports')
  // .then (() => knex.schema.dropTable('summary_report_elements'))
  .then (() => knex.schema.dropTable('summary_report_tags'))
};



