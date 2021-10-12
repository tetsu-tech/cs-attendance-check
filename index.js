const express = require('express');
const { google } = require('googleapis');
const docs = require('@googleapis/docs');

const app = express();

app.get('/', async (req, res) => {
  
  const auth = new docs.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  
  const client = await auth.getClient();

  const googleSheets = google.sheets({version: 'v4', auth: client });

  const spreadsheetId = '1VJFDkHGq8O8aJpdAZFOwwhhLBUycvdn59jAYbTnoUNA';

  const request = {
    spreadsheetId,
    range: 'A1:E2',
  }

  try {
    const response = (await googleSheets.spreadsheets.values.get(request)).data;
    console.log(JSON.stringify(response, null, 2));
    res.send(response.values);
  } catch (err) {
    console.error(err);
  }
})

app.get('/create', async (req, res) => {
  const auth = new docs.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  
  const client = await auth.getClient();

  const googleSheets = google.sheets({version: 'v4', auth: client });

  const spreadsheetId = '1VJFDkHGq8O8aJpdAZFOwwhhLBUycvdn59jAYbTnoUNA';

  const request_body = {
    spreadsheetId,
    resource: {
      requests: [
        {
          "addSheet": {
            "properties": {
              // 毎月のシートを発行
              "title": "yy/mm/1"
            }
          }
        }
      ]
    }
  }

  try {
    const response = (await googleSheets.spreadsheets.batchUpdate(request_body)).data;

    console.log(JSON.stringify(response, null, 2));
    res.send(response.values);
  } catch (error) {
    console.error(error);
  }
})

// barchUpdate使えば新しいシート作成できる
// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate?apix_params=%7B%22spreadsheetId%22%3A%221VJFDkHGq8O8aJpdAZFOwwhhLBUycvdn59jAYbTnoUNA%22%2C%22resource%22%3A%7B%22requests%22%3A%5B%7B%22addSheet%22%3A%7B%22properties%22%3A%7B%22title%22%3A%22test%22%7D%7D%7D%5D%7D%7D
//{
//   "requests": [
//     {
//       "addSheet": {
//         "properties": {
//           "title": "test"
//         }
//       }
//     }
//   ]
// }

app.listen(3600, (req, res) => console.log("running on 3600"))
