const eventModel = require('../models/event');

class EventController {
  constructor() {}

  create(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        eventModel
          .create({ text: req.body.text })
          .then((docs) => {
            resolve(docs);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        reject({ code: 500, msg: 'duplicate id' });
      }
    });
  }

  read(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        eventModel
          .find({})
          .lean()
          .sort('-created_at')
          .exec((err, docs) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(docs);
          });
      } catch (err) {
        reject({ code: 500, msg: 'duplicate id' });
      }
    });
  }

  update(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        let tempData = [];
        eventModel.findOneAndUpdate(
          { _id: req.body.id },
          { $set: { text: req.body.text } },
          { new: false },
          (err, doc) => {
            if (err) {
              reject({ code: 404, msg: 'Data not found' });
              return;
            }

            if (!doc) {
              reject({ code: 404, msg: 'Data not found' });
              return;
            } else {
              resolve({ code: 200, msg: 'updated sucessfully' });
            }
          }
        );
      } catch (err) {}
    });
  }
  delete(req, res) {
    return new Promise(async (resolve, reject) => {
      try {
        let tempData = [];
        eventModel
          .find({ _id: req.params.id })
          .deleteOne()
          .exec((err, docs) => {
            if (err) {
              reject({ code: 404, msg: 'Data not found' });
              return;
            }
            if (docs.deletedCount === 0)
              reject({ code: 404, msg: 'Data not found' });
            else resolve({ code: 200, msg: 'Deleted sucessfully' });
          });
      } catch (err) {}
    });
  }
}

module.exports = new EventController();
