import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes";
import AppLayout from "./src/shared/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;