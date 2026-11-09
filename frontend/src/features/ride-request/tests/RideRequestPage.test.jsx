import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RideRequestPage from '../pages/RideRequestPage';

// Same shape as GET /api/ride-requests/route-options with the demo data (cheapest first).
const ROUTE_OPTIONS = [
  { pickupStop: 'Main Gate', dropStop: 'Registrar Building', routeName: 'Main Gate - Central Library', fare: 20, travelTime: 10 },
  { pickupStop: 'Main Gate', dropStop: 'Central Library', routeName: 'Main Gate - Central Library', fare: 20, travelTime: 10 },
  { pickupStop: 'Main Gate', dropStop: 'Central Library', routeName: 'Main Gate - Muktomancho', fare: 30, travelTime: 15 },
  { pickupStop: 'Central Library', dropStop: 'Muktomancho', routeName: 'Main Gate - Muktomancho', fare: 30, travelTime: 15 },
  { pickupStop: 'Main Gate', dropStop: 'Muktomancho', routeName: 'Main Gate - Muktomancho', fare: 30, travelTime: 15 },
];

/**
 * Makes a fake fetch() response.
 *
 * @param {number} status - HTTP status code.
 * @param {Object} body - JSON body.
 * @returns {Object} Fake response.
 */
function fakeResponse(status, body) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

/**
 * Renders the ride request page with a fake "Your Ride" page to land on.
 *
 * @returns {void}
 */
function renderPage() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<RideRequestPage />} />
        <Route path="/assigned-driver" element={<p>Your Ride page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

/**
 * Waits for the stops to load, then picks pickup and destination.
 *
 * @param {string} pickup - Pickup stop name.
 * @param {string} destination - Destination stop name.
 * @returns {Promise<void>}
 */
async function chooseStops(pickup, destination) {
  await screen.findByRole('option', { name: pickup });
  fireEvent.change(screen.getByLabelText('Pickup Point'), { target: { value: pickup } });
  fireEvent.change(screen.getByLabelText('Destination'), { target: { value: destination } });
}

describe('RideRequestPage', () => {
  let fetchMock;

  beforeEach(() => {
    sessionStorage.setItem('th_auth_token', 'test-token');
    fetchMock = vi.fn((url, options = {}) => {
      if (options.method === 'POST') {
        return Promise.resolve(fakeResponse(201, { data: { requestId: 4, tripId: 2 } }));
      }
      return Promise.resolve(fakeResponse(200, { data: ROUTE_OPTIONS }));
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows pickup points from the database', async () => {
    renderPage();

    expect(await screen.findByRole('option', { name: 'Main Gate' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'JU Gate' })).not.toBeInTheDocument();
  });

  it('shows the cheapest fare and travel time for the chosen stops', async () => {
    renderPage();
    await chooseStops('Main Gate', 'Muktomancho');

    expect(screen.getAllByText(/30/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('15 min').length).toBeGreaterThan(0);
  });

  it('saves the request with the chosen stops and goes to the Your Ride page', async () => {
    renderPage();
    await chooseStops('Main Gate', 'Muktomancho');
    fireEvent.click(screen.getByRole('button', { name: 'Request Ride' }));

    expect(await screen.findByText('Your Ride page')).toBeInTheDocument();

    const [url, options] = fetchMock.mock.calls.find(([, opts]) => opts?.method === 'POST');
    expect(url).toBe('http://localhost:5000/api/ride-requests');
    expect(JSON.parse(options.body)).toEqual({ pickupStop: 'Main Gate', dropStop: 'Muktomancho' });
    expect(options.headers.Authorization).toBe('Bearer test-token');
  });

  it('stays on the form and shows the reason when no vehicle is available', async () => {
    fetchMock.mockImplementation((url, options = {}) => Promise.resolve(
      options.method === 'POST'
        ? fakeResponse(409, { message: 'No vehicle with a free seat is available for this route right now.' })
        : fakeResponse(200, { data: ROUTE_OPTIONS }),
    ));
    renderPage();
    await chooseStops('Main Gate', 'Central Library');
    fireEvent.click(screen.getByRole('button', { name: 'Request Ride' }));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith(
      'No vehicle with a free seat is available for this route right now.',
    ));
    expect(screen.queryByText('Your Ride page')).not.toBeInTheDocument();
  });

  it('stays on the form when pickup or destination is missing', async () => {
    renderPage();
    await screen.findByRole('option', { name: 'Main Gate' });

    fireEvent.click(screen.getByRole('button', { name: 'Request Ride' }));

    expect(window.alert).toHaveBeenCalledWith('Please select pickup and destination.');
    expect(fetchMock.mock.calls.some(([, opts]) => opts?.method === 'POST')).toBe(false);
  });
});
