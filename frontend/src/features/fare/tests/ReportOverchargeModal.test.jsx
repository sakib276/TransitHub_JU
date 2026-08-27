// @vitest-environment jsdom
/**
 * @fileoverview User interaction and form submission tests for ReportOverchargeModal.
 * @module features/fare/tests/ReportOverchargeModal.test
 * @author Nazmus Sakib
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { ReportOverchargeModal } from '../components/ReportOverchargeModal';

expect.extend(matchers);

describe('ReportOverchargeModal Component Tests', () => {
  it('does not render when isModalOpen is false', () => {
    render(
      <ReportOverchargeModal
        isModalOpen={false}
        onCloseModal={vi.fn()}
        onSubmitReport={vi.fn()}
      />
    );

    expect(screen.queryByText(/report overcharging/i)).not.toBeInTheDocument();
  });

  it('submits passenger complaint with correct payload values', async () => {
    const mockSubmitReport = vi.fn().mockResolvedValue({ isSuccessful: true });
    const mockCloseModal = vi.fn();

    render(
      <ReportOverchargeModal
        isModalOpen={true}
        onCloseModal={mockCloseModal}
        onSubmitReport={mockSubmitReport}
      />
    );

    const vehicleInput = screen.getByPlaceholderText(/e\.g\. Rickshaw #104/i);
    const fareInput = screen.getByPlaceholderText(/amount asked/i);
    const detailsInput = screen.getByPlaceholderText(/where did it happen/i);
    const submitBtn = screen.getByRole('button', { name: /submit report/i });

    fireEvent.change(vehicleInput, { target: { value: 'Rickshaw 88' } });
    fireEvent.change(fareInput, { target: { value: '35' } });
    fireEvent.change(detailsInput, { target: { value: 'Overcharged at Bottola' } });

    fireEvent.click(submitBtn);

    expect(mockSubmitReport).toHaveBeenCalledWith({
      vehicleIdentifier: 'Rickshaw 88',
      chargedFareAmount: 35,
      incidentDetails: 'Overcharged at Bottola'
    });
  });
});