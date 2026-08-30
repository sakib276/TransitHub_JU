/**
 * @file Tests for the complaint description component.
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

import ComplaintDescription from '../components/complaint-description';

afterEach(() => {
  cleanup();
});

/**
 * Test suite for ComplaintDescription.
 */
describe('Complaint description', () => {
  /**
   * Verifies that the description field is rendered.
   */
  it('renders the complaint description field', () => {
    render(
      <ComplaintDescription
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByLabelText(/complaint description/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the description field is a textarea.
   */
  it('renders the description as a textarea', () => {
    render(
      <ComplaintDescription
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole('textbox', {
        name: /complaint description/i,
      }),
    ).toHaveAttribute('id', 'complaint-description');
  });

  /**
   * Verifies that the current description value is displayed.
   */
  it('shows the current description value', () => {
    render(
      <ComplaintDescription
        value="The driver was late."
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByLabelText(/complaint description/i),
    ).toHaveValue('The driver was late.');
  });

  /**
   * Verifies that description changes are passed to the parent.
   */
  it('calls onChange when the description changes', () => {
    const handleChange = vi.fn();

    render(
      <ComplaintDescription
        value=""
        onChange={handleChange}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(/complaint description/i),
      {
        target: {
          value: 'Poor service.',
        },
      },
    );

    expect(handleChange).toHaveBeenCalled();
  });
});