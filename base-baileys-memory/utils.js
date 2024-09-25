const { google } = require('googleapis');
// Initializes the Google APIs client library and sets up the authentication using service account credentials.
const auth = new google.auth.GoogleAuth({
    keyFile: './google.json',  // Path to your service account key file.
    scopes: ['https://www.googleapis.com/auth/spreadsheets']  // Scope for Google Sheets API.
});

const spreadsheetId ='1_S6G8ojCDKzAmW-anb26Tli5em3GncRz2oiG8KcHV7Y'

async function appendToSheet(values) {
    const sheets = google.sheets({ version: 'v4', auth });  // Creates a Sheets API client instance.
    const range = 'Sheet1!A1';  // The range in the sheet where data will be written.
    const valueInputOption = 'USER_ENTERED';  // How input data should be interpreted.

    const resource = { values: [values] };  // The data to be written.

    try {
        const res = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption,
            resource,
        });
        return res;  // Returns the response from the Sheets API.
    } catch (error) {
        console.error('error', error);  // Logs errors.
    }
}

module.exports = { appendToSheet }