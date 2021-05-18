/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
/**
 * Created by LXHFIGHT on 2017/2/17 21:49.
 * Email: lxhfight1@gmail.com
 * Description:
 *  mysql database connection configuration
 */
// TODO edit the database connection information
// database info for develop environment
const devConfig = {
  database: '', // TODO replace the real database name with {databaseName} here
  username: 'root', // TODO replace the real user name with {userName} here
  password: '', // TODO replace the real password with {password} here
  options: {
    host: '', // hostname
    port: 3306, // port
    dialect: 'mysql', // database SQL dialect
    timezone: '+08:00', // database timezone ('+08:00 Beijing')
    pool: {
      max: 20, // the maximum connect amount of the database
      min: 0, // the minimum connect amount of the database
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
}

// database info for production environment
const productConfig = {
  database: '', // TODO replace the real database name with {databaseName} here
  username: 'root',         // TODO replace the real user name with {userName} here
  password: '', // TODO replace the real password with {password} here
  options: {
    host: 'localhost', // hostname
    port: 3306, // port
    dialect: 'mysql', // database SQL dialect
    timezone: '+08:00', // database timezone ('+08:00 Beijing')
    pool: {
      max: 20, // the maximum connect amount of the database
      min: 0, // the minimum connect amount of the database
      idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
    }
  }
}

module.exports = process.env.NODE_ENV ? productConfig : devConfig
