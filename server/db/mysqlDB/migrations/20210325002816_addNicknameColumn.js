
exports.up = function(knex, Promise) {
  return knex.raw(`
    ALTER TABLE apikeys
      ADD COLUMN nickname VARCHAR(45) NOT NULL DEFAULT (0) AFTER account_name;
    `)
    .then(() => knex.raw(`
      Update apikeys SET nickname = account_name Where nickname = 0
    `))
};

exports.down = function(knex, Promise) {
  return knex.raw(`
    ALTER TABLE apikeys
      DROP COLUMN nickname 
    `)
};
