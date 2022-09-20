import { Pool } from 'pg';

const database = new Pool({
  user: 'tester',
  host: 'localhost',
  database: 'test_db',
  password: 'qwer',
  port: 5432,
});

database.connect(
  (error) => {
    if (error) {
      console.log(`Error: ${error}`);
    }
  }
);

export default database;