// @vitest-environment jsdom
/**
 * @fileoverview Integration and UI tests for SharedRidePage using Vitest and RTL.
 * Tests route filtering, details modal, booking interaction, and request creation.
 * @module features/shared-ride/tests/SharedRidePage.test
 * @author Nazmus Sakib
 */

import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { SharedRidePage } from '../pages/SharedRidePage';

expect.extend(matchers);

describe('SharedRidePage Component Integration Tests (SRS FR-6)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders page headers, route search controls and available rides', async () => {
    render(<SharedRidePage />);

    expect(screen.getByRole('heading', { name: /join shared ride/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create ride request/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^to/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /available shared rides/i })).toBeInTheDocument();

    // Wait for async ride cards to render
    const viewButtons = await screen.findAllByRole('button', { name: /view details/i });
    expect(viewButtons.length).toBeGreaterThan(0);
  });

  it('filters rides based on selected pickup location', async () => {
    const { container } = render(<SharedRidePage />);

    // Wait until ride cards appear in DOM
    await screen.findAllByRole('button', { name: /view details/i });

    const ridesStack = container.querySelector('.sr-rides-stack');
    expect(within(ridesStack).getByText('Ladies Hall Road')).toBeInTheDocument();
    expect(within(ridesStack).getByText('Bishmile')).toBeInTheDocument();

    const fromSelect = screen.getByLabelText(/^from/i);
    fireEvent.change(fromSelect, { target: { value: 'Ladies Hall Road' } });

    // Scoped check inside ride list: only matched route is shown, others are filtered out
    expect(within(ridesStack).getByText('Ladies Hall Road')).toBeInTheDocument();
    expect(within(ridesStack).getByText('Prantic')).toBeInTheDocument();
    expect(within(ridesStack).queryByText('Bishmile')).not.toBeInTheDocument();
  });

  it('swaps pickup and destination locations when swap button is clicked', () => {
    render(<SharedRidePage />);

    const fromSelect = screen.getByLabelText(/^from/i);
    const toSelect = screen.getByLabelText(/^to/i);
    const swapButton = screen.getByTitle(/swap pickup and destination/i);

    fireEvent.change(fromSelect, { target: { value: 'CSE' } });
    fireEvent.change(toSelect, { target: { value: 'Dairy Gate' } });

    fireEvent.click(swapButton);

    expect(fromSelect.value).toBe('Dairy Gate');
    expect(toSelect.value).toBe('CSE');
  });

  it('opens and closes the Ride Details modal with driver information (FR-6.1.2)', async () => {
    render(<SharedRidePage />);

    const viewDetailsButtons = await screen.findAllByRole('button', { name: /view details/i });
    expect(viewDetailsButtons.length).toBeGreaterThan(0);

    fireEvent.click(viewDetailsButtons[0]);

    expect(await screen.findByRole('heading', { name: /ride details/i })).toBeInTheDocument();
    expect(screen.getByText(/joined co-passengers/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /ride details/i })).not.toBeInTheDocument();
    });
  });

  it('allows a passenger to book an open shared ride (FR-6.1.3)', async () => {
    render(<SharedRidePage />);

    const bookButtons = await screen.findAllByRole('button', { name: /book shared ride/i });
    expect(bookButtons.length).toBeGreaterThan(0);

    fireEvent.click(bookButtons[0]);

    expect(await screen.findByText(/successfully booked your seat/i)).toBeInTheDocument();
  });

  it('opens Create Ride modal and validates submission (FR-6.2.1)', async () => {
    render(<SharedRidePage />);

    const openCreateBtn = screen.getByRole('button', { name: /create ride request/i });
    fireEvent.click(openCreateBtn);

    expect(await screen.findByRole('heading', { name: /create shared ride request/i })).toBeInTheDocument();

    const pickupInput = screen.getByLabelText(/pickup point \*/i);
    const destInput = screen.getByLabelText(/destination \*/i);
    const publishBtn = screen.getByRole('button', { name: /publish ride/i });

    fireEvent.change(pickupInput, { target: { value: 'Bottola' } });
    fireEvent.change(destInput, { target: { value: 'Central Library' } });
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /create shared ride request/i })).not.toBeInTheDocument();
    });
  });
});