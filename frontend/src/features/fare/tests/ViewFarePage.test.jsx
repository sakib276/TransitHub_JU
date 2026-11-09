// @vitest-environment jsdom
/**
 * @fileoverview Integration and UI tests for ViewFarePage using Vitest and React Testing Library.
 * @module features/fare/tests/ViewFarePage.test
 * @author Nazmus Sakib
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { ViewFarePage } from '../pages/ViewFarePage';

expect.extend(matchers);

describe('ViewFarePage Component Tests (SRS FR-5.1)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders page headings, dropdowns and calculate button', () => {
    render(<ViewFarePage />);
    
    expect(screen.getByRole('heading', { name: /view fare/i })).toBeInTheDocument();
    expect(screen.getByText(/predefined fare list/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate fare/i })).toBeInTheDocument();
  });

  it('shows empty placeholder box before any route is calculated', () => {
    render(<ViewFarePage />);
    
    expect(screen.getByText(/fare will appear here after selection/i)).toBeInTheDocument();
  });

  it('calculates and displays official rickshaw and cart fare on valid selection', () => {
    render(<ViewFarePage />);

    const fromSelect = screen.getByLabelText(/^from/i);
    const toSelect = screen.getByLabelText(/^to/i);
    const calculateButton = screen.getByRole('button', { name: /calculate fare/i });

    fireEvent.change(fromSelect, { target: { value: 'CSE' } });
    fireEvent.change(toSelect, { target: { value: 'Dairy Gate' } });
    fireEvent.click(calculateButton);

    expect(screen.getByText(/rickshaw fare/i)).toBeInTheDocument();
    expect(screen.getByText(/cart fare/i)).toBeInTheDocument();
    expect(screen.getByText('৳ 20')).toBeInTheDocument();
    expect(screen.getByText('৳ 10')).toBeInTheDocument();
  });

  it('swaps pickup and destination locations when swap button is clicked', () => {
    render(<ViewFarePage />);

    const fromSelect = screen.getByLabelText(/^from/i);
    const toSelect = screen.getByLabelText(/^to/i);
    const swapButton = screen.getByTitle(/swap locations/i);

    fireEvent.change(fromSelect, { target: { value: 'CSE' } });
    fireEvent.change(toSelect, { target: { value: 'Dairy Gate' } });

    fireEvent.click(swapButton);

    expect(fromSelect.value).toBe('Dairy Gate');
    expect(toSelect.value).toBe('CSE');
  });

  it('displays warning alert when an unlisted route is selected', () => {
    render(<ViewFarePage />);

    const fromSelect = screen.getByLabelText(/^from/i);
    const toSelect = screen.getByLabelText(/^to/i);
    const calculateButton = screen.getByRole('button', { name: /calculate fare/i });

    fireEvent.change(fromSelect, { target: { value: 'Bishmile' } });
    fireEvent.change(toSelect, { target: { value: 'Mir Mosharraf Hossain Hall' } });
    fireEvent.click(calculateButton);

    expect(screen.getByText(/no official fare available/i)).toBeInTheDocument();
  });

  it('opens overcharge report modal dialog when report text is clicked', () => {
    render(<ViewFarePage />);

    const reportLink = screen.getByText(/report via the help center/i);
    fireEvent.click(reportLink);

    expect(screen.getByRole('heading', { name: /report overcharging/i })).toBeInTheDocument();
  });
});