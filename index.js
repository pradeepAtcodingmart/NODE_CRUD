const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

var data = [{ id: 1, text: 'The shortest article. Ever.' }];

app.get('', (req, res) =>
  res.json({ code: 200, msg: 'mockData Server running' })
);

app.post('/mockData', (req, res) => {
  try {
    const duplicateData = data.filter(d => d.id === req.body.id);

    if (duplicateData.length === 0) {
      data.push(req.body);
      res.json(data);
    } else {
      res.json({ code: 500, msg: 'duplicate id' });
    }
  } catch (err) {
    res.json({ code: 500, msg: err });
  }
});

app.get('/mockData', (req, res) => {
  try {
    res.json(data);
  } catch (err) {
    res.json({ code: 500, msg: err });
  }
});

app.put('/mockData', (req, res) => {
  try {
    let tempData = [];
    data.map((d, index) => {
      if (d.id === req.body.id) {
        tempData[index] = { ...req.body };
      } else {
        tempData[index] = { ...d };
      }
    });
    if (data.length !== tempData.length)
      res.json({ code: 404, msg: 'id not found' });
    else {
      data = [...tempData];
      res.json({ code: 200, msg: 'updated sucessfully' });
    }
  } catch (err) {
    res.json({ code: 500, msg: err });
  }
});

app.delete('/mockData/:id', (req, res) => {
  try {
    let tempData = [];
    data.map(d => {
      if (d.id !== parseInt(req.params.id)) {
        tempData = [...tempData, d];
      }
    });

    if (data.length === tempData.length)
      res.json({ code: 404, msg: 'id not found' });
    else {
      data = [...tempData];
      res.json({ code: 200, msg: 'deleted sucessfully' });
    }
  } catch (err) {
    res.json({ code: 500, msg: err });
  }
});

app.listen(5000, () => console.log('Running port :5000'));
