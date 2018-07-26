exports.up = function(knex, Promise) {
    return knex.schema.table('roommates', function(t) {
        t.bool('archived').notNull().defaultTo(false);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('roommates', function(t) {
        t.dropColumn('archived');
    });
};
