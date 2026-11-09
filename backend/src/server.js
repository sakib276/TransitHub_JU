// Load the .env file FIRST, so every other file can read process.env values.
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TransitHub JU backend running on http://localhost:${PORT}`);
});
