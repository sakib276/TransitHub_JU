import React from 'react';
// কার্লি ব্র্যাকেট { ViewFarePage } ব্যবহার করা হয়েছে
import { ViewFarePage } from './features/fare/pages/ViewFarePage';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <ViewFarePage />
    </div>
  );
}

export default App;