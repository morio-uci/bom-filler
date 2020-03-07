require('dotenv').config()

const config = {
  development: {
    client: 'postgresql',
    connection: {
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_SERVICE_HOST,
      port: process.env.POSTGRES_SERVICE_PORT
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds/dev',
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      database: process.env.POSTGRES_TEST_DB,
      user: process.env.POSTGRES_TEST_USER || process.env.POSTGRES_USER,
      password: process.env.POSTGRES_TEST_PASSWORD || process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_SERVICE_TEST_HOST || process.env.POSTGRES_SERVICE_HOST,
      port: process.env.POSTGRES_SERVICE__TEST_PORT || process.env.POSTGRES_SERVICE_PORT
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds/test',
    },
  }

}

export const { client, connection, migrations, seeds } = config[process.env.NODE_ENV || 'development'];
