require('dotenv').config()
module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_SERVICE_HOST,
            port: process.env.POSTGRES_SERVICE_PORT
        }
    }
}