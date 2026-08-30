/**
 * @file Integration tests for the passenger complaint form.
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

import ComplaintForm from '../components/complaint-form';

afterEach(() => {
  cleanup();
});

/**
 * Test suite for the passenger complaint form.
 */
describe('Passenger complaint form', () => {
  /**
   * Verifies that the complaint category field is rendered.
   */
  it('renders the complaint category field', () => {
    render(
      <ComplaintForm onSubmit={() => {}} />,
    );

    expect(
      screen.getByLabelText(/complaint category/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the related ride field is available.
   */
  it('renders the related ride field as optional', () => {
    render(
      <ComplaintForm onSubmit={() => {}} />,
    );

    expect(
      screen.getByLabelText(/related ride/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: /no specific ride/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the complaint description field is rendered.
   */
  it('renders the complaint description field', () => {
    render(
      <ComplaintForm onSubmit={() => {}} />,
    );

    expect(
      screen.getByLabelText(/complaint description/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the submit button is rendered.
   */
  it('renders the submit complaint button', () => {
    render(
      <ComplaintForm onSubmit={() => {}} />,
    );

    expect(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that submission is prevented when
   * required complaint fields are missing.
   */
  it('prevents submission when required fields are missing', () => {
    const handleSubmit = vi.fn();

    render(
      <ComplaintForm onSubmit={handleSubmit} />,
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    );

    expect(handleSubmit).not.toHaveBeenCalled();

    expect(
      screen.getByText(
        'Complaint category is required.',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Complaint description is required.',
      ),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that a general complaint can be submitted
   * without selecting a related ride.
   */
  it('allows a passenger to submit a general complaint without a related ride', () => {
    const handleSubmit = vi.fn();

    render(
      <ComplaintForm onSubmit={handleSubmit} />,
    );

    fireEvent.change(
      screen.getByLabelText(/complaint category/i),
      {
        target: {
          value: 'SERVICE',
        },
      },
    );

    fireEvent.change(
      screen.getByLabelText(/complaint description/i),
      {
        target: {
          value: 'The service is frequently delayed.',
        },
      },
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    );

    expect(handleSubmit).toHaveBeenCalledWith({
      category: 'SERVICE',
      description: 'The service is frequently delayed.',
      relatedRide: '',
    });
  });
});