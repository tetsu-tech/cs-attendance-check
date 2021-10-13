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
  
  let today = new Date();
  today.setTime(today.getTime() + 1000*60*60*9); // JSTに変換

  let nextMonth =  new Date(today.getFullYear(), today.getMonth() + 1, 1);
  nextMonth.setTime(nextMonth.getTime() + 1000*60*60*9)

  const nextMonthToString = nextMonth.toDateString();

  const titleDate = nextMonthToString.split(" ");
  console.log(titleDate);

  const request_body = {
    spreadsheetId,
    resource: {
      requests: [
        {
          "addSheet": {
            "properties": {
              "title": `${titleDate[3]}/${titleDate[1]}`
            }
          }
        }
      ]
    }
  }

  // ここを分岐させる
  if (today.getTime() === nextMonth.getTime()) {
    try {
      const response = (await googleSheets.spreadsheets.batchUpdate(request_body)).data;
  
      console.log(JSON.stringify(response, null, 2));
      res.send(response.values);
    } catch (error) {
      console.error(error);
    }
  } else {
    // テスト用
    // try {
    //   const response = (await googleSheets.spreadsheets.batchUpdate(request_body)).data;
  
    //   console.log(JSON.stringify(response, null, 2));
    //   res.send("Yeaaaaaaa!!!!")
    // } catch (error) {
    //   console.error(error);
    // }
    res.send("Yeaaaaaaa!!!!")
  }
})

app.listen(3600, (req, res) => console.log("running on 3600"))
