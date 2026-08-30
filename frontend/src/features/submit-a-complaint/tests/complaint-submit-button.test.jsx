/**
 * @file Tests for the complaint submission button component.
 */

import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';

import '@testing-library/jest-dom/vitest';

import ComplaintSubmitButton from '../components/complaint-submit-button';

afterEach(() => {
  cleanup();
});

/**
 * Test suite for ComplaintSubmitButton.
 */
describe('Complaint submit button', () => {
  /**
   * Verifies that the submit button is rendered.
   */
  it('renders the submit complaint button', () => {
    render(<ComplaintSubmitButton />);

    expect(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the button uses submit type.
   */
  it('renders as a submit button', () => {
    render(<ComplaintSubmitButton />);

    expect(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    ).toHaveAttribute('type', 'submit');
  });

  /**
   * Verifies that the button is enabled by default.
   */
  it('is enabled by default', () => {
    render(<ComplaintSubmitButton />);

    expect(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    ).toBeEnabled();
  });

  /**
   * Verifies that the button is disabled during submission.
   */
  it('is disabled while submitting', () => {
    render(
      <ComplaintSubmitButton
        isSubmitting
      />,
    );

    expect(
      screen.getByRole('button', {
        name: /submitting/i,
      }),
    ).toBeDisabled();
  });
});