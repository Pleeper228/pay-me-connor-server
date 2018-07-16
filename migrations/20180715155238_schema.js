
exports.up = function(knex, Promise) {
  return knex.schema.createTable('houses', (table) => {
    table.increments()
    table.timestamps(true, true)
    table.text('name')
  }).createTable('users', (table) => {
    table.increments()
    table.timestamps(true, true)
    table.text('email').unique()
    table.text('password')
    table.integer('house_id').unsigned()
    table.foreign('house_id').references('id').inTable('houses').onDelete('set null')
  }).createTable('roommates', (table) => {
    table.increments()
    table.timestamps(true, true)
    table.text('name')
    table.integer('house_id').unsigned().notNull()
    table.foreign('house_id').references('id').inTable('houses').onDelete('cascade')
  }).createTable('bills', (table) => {
    table.increments()
    table.timestamps(true, true)
    table.text('name')
    table.float('amount')
    table.integer('house_id').unsigned().notNull()
    table.foreign('house_id').references('id').inTable('houses').onDelete('cascade')
  }).createTable('payments', (table) => {
    table.increments()
    table.timestamps(true, true)
    table.float('amount')
    table.timestamp('date')
    table.integer('roommate_id').unsigned().notNull()
    table.foreign('roommate_id').references('id').inTable('roommates').onDelete('cascade')
    table.integer('bill_id').unsigned().notNull()
    table.foreign('bill_id').references('id').inTable('bills').onDelete('cascade')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('payments')
    .dropTable('bills')
    .dropTable('roommates')
    .dropTable('users')
    .dropTable('houses')
};
