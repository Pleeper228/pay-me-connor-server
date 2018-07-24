
exports.up = function(knex, Promise) {
  return knex.schema.table('payments', (table) => {
    table.dropColumn('date')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('payments', function(t) {
      t.enum('date').notNull();
  });
};
