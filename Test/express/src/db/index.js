const { Pool } = require('pg');

class Database {
  #database;

  constructor() {
    this.#connect();
  }

  async #connect() {
    this.#database = new Pool({
      user: 'tester',
      host: 'localhost',
      database: 'test_db',
      password: 'qwer',
      port: 5432,
    });
    try {
      await this.#database.connect();
    } catch (error) {
      console.log('Database connect failed.');
    }
  }

  async query(_query) {
    return await this.#database.query(_query);
  }
}

const database = new Database();
module.exports = database;