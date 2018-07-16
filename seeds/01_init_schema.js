
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('houses').del(),
    knex('users').del(),
    knex('roommates').del(),
    knex('bills').del(),
    knex('payments').del()
  ]).then(function () {
    return knex('houses').insert([{
      id: 1,
      name: 'Test House'
    }]);
  }).then(function () {
    return knex('users').insert([{
      id: 1,
      email: 'test@test.com',
      password: 'password',
      house_id: 1
    }]);
  }).then(function () {
    return knex('roommates').insert([{
      id: 1,
      name: 'Roommate 1',
      house_id: 1
    }, {
      id: 2,
      name: 'Roommate 2',
      house_id: 1
    }]);
  }).then(function () {
    return knex('bills').insert([{
      id: 1,
      name: 'Bill 1',
      amount: 100.10,
      house_id: 1
    }, {
      id: 2,
      name: 'Bill 2',
      amount: 200.20,
      house_id: 1
    }]);
  }).then(function () {
    return knex('payments').insert([{
      id: 1,
      amount: 10.10,
      roommate_id: 1,
      bill_id: 1
    }, {
      id: 2,
      amount: 20.20,
      roommate_id: 1,
      bill_id: 2
    }, {
      id: 3,
      amount: 30.30,
      roommate_id: 2,
      bill_id: 1
    }, {
      id: 4,
      amount: 40.40,
      roommate_id: 2,
      bill_id: 2
    }]);
  }).then(() => {
      return knex.raw(`
        ALTER SEQUENCE houses_id_seq RESTART WITH 2;
        ALTER SEQUENCE users_id_seq RESTART WITH 2;
        ALTER SEQUENCE roommates_id_seq RESTART WITH 3;
        ALTER SEQUENCE bills_id_seq RESTART WITH 3;
        ALTER SEQUENCE payments_id_seq RESTART WITH 5;
      `);
    })
};
