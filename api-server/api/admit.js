import { createReadStream, existsSync } from 'fs';
import { parse } from 'csv-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { email, parentEmail } = req.body || {};
  if (!email || !parentEmail) {
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
    const emailMatch = (record['Email'] || '').trim().toLowerCase() === email.trim().toLowerCase();
    const pwMatch = (record['Parent Email'] || '').trim().toLowerCase() === parentEmail.trim().toLowerCase();
    if (emailMatch && pwMatch) {
      res.status(200).json({ url: record.URL || record.url });
      found = true;
      break;
    }
  }
  if (!found) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
