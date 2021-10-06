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
    range: 'A1:B1',
  }

  try {
    const response = (await googleSheets.spreadsheets.values.get(request)).data;
    console.log(JSON.stringify(response, null, 2));
    res.send(response)
  } catch (err) {
    console.error(err);
  }

})

app.listen(3600, (req, res) => console.log("running on 3600"))