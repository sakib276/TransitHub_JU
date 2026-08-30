/**
 * @file Tests for the optional related ride component.
 */

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import '@testing-library/jest-dom/vitest';

import ComplaintRelatedRide from '../components/complaint-related-ride';

afterEach(() => {
  cleanup();
});

/**
 * Test suite for ComplaintRelatedRide.
 */
describe('Complaint related ride', () => {
  /**
   * Verifies that the related ride field is rendered.
   * 
   */
  it('renders the related ride field', () => {
    render(
      <ComplaintRelatedRide
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByLabelText(/related ride/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the related ride field is optional.
   */
  it('allows no specific ride to be selected', () => {
    render(
      <ComplaintRelatedRide
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole('option', {
        name: /no specific ride/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that available rides are displayed.
   */
  it('renders available ride options', () => {
    render(
      <ComplaintRelatedRide
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole('option', {
        name: /ride ride-001/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: /ride ride-002/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that ride changes are passed to the parent.
   */
  it('calls onChange when a ride is selected', () => {
    const handleChange = vi.fn();

    render(
      <ComplaintRelatedRide
        value=""
        onChange={handleChange}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(/related ride/i),
      {
        target: {
          value: 'RIDE-001',
        },
      },
    );

    expect(handleChange).toHaveBeenCalled();
  });
});