import AssignedDriverPage from '../features/driver-vehicle/pages/AssignedDriverPage.jsx';

/**
 * Root component. This branch only has the driver-vehicle feature so far,
 * so it renders that page directly instead of using a router.
 *
 * @returns {JSX.Element} App root.
 */
function App() {
  return <AssignedDriverPage />;
}

export default App;
