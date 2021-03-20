
exports.up = function(knex, Promise) {
  return knex.raw(`
    ALTER TABLE users
      ADD COLUMN password_last_changed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER passhash
    `)
  .then (() => {
    return knex.raw(`
      ALTER TABLE users
        ADD COLUMN email_last_changed TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER email;
      `)
  })
};

exports.down = function(knex, Promise) {
  return knex.raw(`
    ALTER TABLE users
      DROP COLUMN password_last_changed 
    `)
  .then (() => {
    return knex.raw(`
      ALTER TABLE users
        DROP COLUMN email_last_changed;
      `)
  })
};
