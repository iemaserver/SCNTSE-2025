import { createReadStream, existsSync } from 'fs';
import { parse } from 'csv-parse';

// Add CORS headers for all responses
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { email, parentEmail } = req.body || {};
  if (!email) {
    res.status(400).json({ message: 'Missing credentials' });
    return;
  }

  // Use process.cwd() for Vercel compatibility
  const csvPath = process.cwd() + '/api/uploaded_admit_cards.csv';
  if (!existsSync(csvPath)) {
    res.status(500).json({ message: 'Admit card data unavailable' });
    return;
  }

  let found = false;
  const parser = createReadStream(csvPath).pipe(parse({ columns: true, trim: true, delimiter: ',' }));
  for await (const record of parser) {
    const recordEmail = (record['Email'] || '').trim().toLowerCase();
    const recordParentEmail = (record['Parent Email'] || '').trim().toLowerCase();
    const inputEmail = email.trim().toLowerCase();
    const inputParentEmail = (parentEmail || '').trim().toLowerCase();

    if (recordEmail === inputEmail) {
      if (recordParentEmail) {
        // Parent email exists, must match and not be blank
        if (inputParentEmail && recordParentEmail === inputParentEmail) {
          res.status(200).json({ url: record.URL || record.url });
          found = true;
          break;
        }
      } else {
        // No parent email in record, allow blank password
        if (!inputParentEmail) {
          res.status(200).json({ url: record.URL || record.url });
          found = true;
          break;
        }
      }
    }
  }
  if (!found) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
