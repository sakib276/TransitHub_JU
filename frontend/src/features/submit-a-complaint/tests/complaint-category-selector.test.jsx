/**
 * @file Tests for the complaint category selector component.
 */

import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import ComplaintCategorySelector from '../components/complaint-category-selector';

/**
 * Test suite for ComplaintCategorySelector.
 */
describe('Complaint category selector', () => {
  /**
   * Verifies that the category field is rendered.
   */
  it('renders the complaint category field', () => {
    render(
      <ComplaintCategorySelector
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByLabelText(/complaint category/i),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that all supported complaint categories are available.
   */
  it('renders all complaint category options', () => {
    render(
      <ComplaintCategorySelector
        value=""
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole('option', { name: /driver/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: /service/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', { name: /ride/i }),
    ).toBeInTheDocument();
  });

  /**
   * Verifies that the selected value is displayed.
   */
  it('shows the selected complaint category', () => {
    render(
      <ComplaintCategorySelector
        value="DRIVER"
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByLabelText(/complaint category/i),
    ).toHaveValue('DRIVER');
  });

  /**
   * Verifies that category changes are passed to the parent.
   */
  it('calls onChange when the category changes', () => {
    const handleChange = vi.fn();

    render(
      <ComplaintCategorySelector
        value=""
        onChange={handleChange}
      />,
    );

    fireEvent.change(
      screen.getByLabelText(/complaint category/i),
      {
        target: { value: 'SERVICE' },
      },
    );

    expect(handleChange).toHaveBeenCalled();
  });
});