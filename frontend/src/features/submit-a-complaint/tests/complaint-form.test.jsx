/**
 * @file Tests for the passenger complaint form component.
 */

import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import ComplaintForm from '../components/complaint-form';

/**
 * Test suite for the passenger complaint form.
 */
describe('Passenger complaint form', () => {
  /**
   * Verifies that the complaint category field is displayed.
   */
  it('renders the complaint category field', () => {
    render(<ComplaintForm />);

    expect(
      screen.getByLabelText(/complaint category/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the related ride field is displayed
   * as an optional form field.
   */
  it('renders the related ride field as optional', () => {
    render(<ComplaintForm />);

    expect(
      screen.getByLabelText(/related ride/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the complaint description field is displayed.
   */
  it('renders the complaint description field', () => {
    render(<ComplaintForm />);

    expect(
      screen.getByLabelText(/complaint description/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the complaint submission button is displayed.
   */
  it('renders the submit complaint button', () => {
    render(<ComplaintForm />);

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

    render(<ComplaintForm onSubmit={handleSubmit} />);

    fireEvent.click(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    );

    expect(handleSubmit).not.toHaveBeenCalled();

    expect(
      screen.getByText(
        /complaint category is required/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /complaint description is required/i,
      ),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that a general complaint can be submitted
   * without selecting a related ride.
   */
  it('allows a passenger to submit a general complaint without a related ride', () => {
    const handleSubmit = vi.fn();

    render(<ComplaintForm onSubmit={handleSubmit} />);

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
          value:
            'The service was not satisfactory.',
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
      relatedRide: '',
      description:
        'The service was not satisfactory.',
    });
  });
});