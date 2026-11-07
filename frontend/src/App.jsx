import { BrowserRouter } from 'react-router-dom';

import AppRoutes from './routes';

/**
 * Root component of the TransitHub JU frontend.
 *
 * @returns {JSX.Element} Root application component.
 */
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;