'use strict'

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052,
    },
    db: {
        host: process.env.DEV_DB_HOST || "localhost",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "shopDev",
    },
}
const prod = {
    app: {
        port: process.env.PROD_APP_PORT,
    },
    db: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT,
        name: process.env.PROD_DB_NAME,
    },
}
const config = { dev, prod }
const env = process.env.NODE_ENV || "dev"
module.exports = config[env]