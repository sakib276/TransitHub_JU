/**
 * @fileoverview Server entry point for TransitHub JU backend.
 */

import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 TransitHub_JU Server is running on port: ${PORT}`);
  console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`🚍 Fare API:   http://localhost:${PORT}/api/fares`);
  console.log(`==================================================\n`);
});