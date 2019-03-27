const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

module.exports = [
  {
    "type": "postgres",
    "host": DB_HOST,
    "port": DB_PORT,
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "autoSchemaSync": false,
    "entities": [`./**/*.entity.ts`],
    "migrations": [
      "src/migration/*.ts"
    ],
    "cli": {
      "migrationsDir": "src/migration",
    }
  },
  {
    "type": "postgres",
    "name": "seed",
    "host": DB_HOST,
    "port": DB_PORT,
    "username": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "migrations": [
      "src/seeds/*.ts"
    ],
    "cli": {
      "migrationsDir": "src/seeds",
    }
  }
];
