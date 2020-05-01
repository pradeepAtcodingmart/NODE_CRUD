const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

class CmsDB {
  constructor() {}

  static connect() {
    return new Promise(async (resolve, reject) => {
      let config = {};
      try {
        if (global.env === 'development') {
          config = require('../config.json').database.cmsDB.development;
        } else {
          //set db config for production
        }
      } catch (err) {
        reject(err);
        return;
      }

      mongoose
        .connect(`mongodb://${config.host}:${config.port}/${config.database}`, {
          useNewUrlParser: true,
          // reconnectTries: Number.MAX_VALUE,
          // reconnectInterval: 1000,
          poolSize: 100,
        })
        .then(() => {
          console.log('DB Connection Established !');
          mongoose.connection.on('error', (err) => {
            global.log.error(err);
          });
          resolve(this);
        })
        .catch((err) => {
          console.log('DB Connection Error !', err);

          reject(err);
        });
    });
  }

  static close() {
    mongoose.disconnect();
  }
}

module.exports = CmsDB;
