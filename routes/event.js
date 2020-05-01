const router = require('express').Router();

class CityRouter {
  constructor(controller) {
    this.controller = controller;
    this.init();
  }

  init() {
    router.post('/mockData', async (req, res) => {
      try {
        const data = await this.controller.create(req, res);
        res.json({ code: 200, data: data });
      } catch (err) {
        res.json(err);
      }
      res.end();
    });

    router.get('/mockData', async (req, res) => {
      try {
        const data = await this.controller.read(req, res);
        res.json({ code: 200, data: data });
      } catch (err) {
        console.log(err);
        res.json(err);
      }
      res.end();
    });

    router.put('/mockData', async (req, res) => {
      try {
        const data = await this.controller.update(req, res);
        res.json(data);
      } catch (err) {
        res.json(err);
      }

      res.end();
    });

    router.delete('/mockData/:id', async (req, res) => {
      try {
        const data = await this.controller.delete(req, res);
        res.json(data);
      } catch (err) {
        res.json(err);
      }

      res.end();
    });
  }

  getRouter() {
    return router;
  }
}

module.exports = (controller) => {
  return new CityRouter(controller);
};
