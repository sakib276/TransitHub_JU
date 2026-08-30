/**
 * @file Tests for the submit-a-complaint page.
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

import SubmitAComplaintPage from '../pages/submit-a-complaint-page';

afterEach(() => {
  cleanup();
});

/**
 * Test suite for SubmitAComplaintPage.
 */
describe('Submit a complaint page', () => {
  /**
   * Verifies that the page heading is rendered.
   */
  it('renders the submit a complaint heading', () => {
    render(<SubmitAComplaintPage />);

    expect(
      screen.getByRole('heading', {
        name: /submit a complaint/i,
      }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the complaint form is rendered.
   */
  it('renders the complaint form', () => {
    render(<SubmitAComplaintPage />);

    expect(
      screen.getByLabelText(/complaint category/i),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/complaint description/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /submit complaint/i,
      }),
    ).toBeInTheDocument();
  });
});