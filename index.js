global.env = process.env.NODE_ENV === undefined ? 'development' : 'production';

const PORT = 8080;
const SERVER_TIMEOUT_DURATION = 50000;

const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const HttpServer = require('http').createServer(app);

global.log = require('logger').createLogger('dev.log');
global.log.setLevel('error');

class Server {
  constructor() {
    this.models = [];
    this.init();
  }

  async init() {
    try {
      await this.initDrivers();
      this.initControllers();
      this.initExpress();
      this.initRoutes();
      this.initServer();
    } catch (err) {
      console.log(err);
      global.log.error(err);
      process.exit(0);
    }
  }

  initExpress() {
    //Enable request compression
    app.use(compression());
    app.use(bodyParser.json()); // to support JSON-encoded bodies

    if (global.env === 'development') {
      app.use(require('cors')());
    }
  }

  initServer() {
    console.log('----------init server-----------');
    app
      .listen(PORT, () => {
        console.log(`Server Running ${PORT}`);
      })
      .setTimeout(SERVER_TIMEOUT_DURATION);
  }

  initDrivers() {
    return new Promise(async (resolve, reject) => {
      try {
        this.cmsDB = await require('./driver/cms-db').connect();
        this.models.push(this.cmsDB);

        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  }

  initControllers() {
    console.log('----------init controller-----------');
    this.eventController = require('./controllers/event');
  }

  initRoutes() {
    console.log('----------init routes-----------');

    const colours = {
      GET: '\x1b[32m',
      POST: '\x1b[34m',
      DELETE: '\x1b[31m',
      PUT: '\x1b[33m',
    };

    app.use('*', (req, _, next) => {
      console.log(colours[req.method] + req.method, '\x1b[0m' + req.baseUrl);
      next();
    });
    const eventRouter = require('./routes/event')(this.eventController);

    app.use('/', eventRouter.getRouter());
  }

  onClose() {
    //Close all DB Connections
    this.models.map((m) => {
      m.close();
    });

    HttpServer.close();
  }
}

const server = new Server();

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((eventType) => {
  process.on(eventType, (err) => {
    global.log.error(err);
    server.onClose();
    //to avoid executing multiple times
    server.onClose = () => {};
    process.exit(-1);
  });
});
