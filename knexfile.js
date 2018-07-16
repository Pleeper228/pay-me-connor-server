module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/pay_me_connor'
  },
  production: {
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`
  }
};
