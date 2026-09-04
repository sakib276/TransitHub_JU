import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import EmergencyButton from '../components/EmergencyButton';

describe('EmergencyButton', () => {
  it('calls onPress when clicked', () => {
    const onPress = vi.fn();

    render(
      <EmergencyButton
        status="idle"
        errorMessage=""
        disabled={false}
        disabledReason=""
        onPress={onPress}
        onRetry={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /report emergency/i }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled and shows the reason when there is no active trip', () => {
    render(
      <EmergencyButton
        status="idle"
        errorMessage=""
        disabled
        disabledReason="No active trip."
        onPress={vi.fn()}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /report emergency/i })).toBeDisabled();
    expect(screen.getByText('No active trip.')).toBeInTheDocument();
  });

  it('shows the sending state', () => {
    render(
      <EmergencyButton
        status="sending"
        errorMessage=""
        disabled={false}
        disabledReason=""
        onPress={vi.fn()}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /sending alert/i })).toBeDisabled();
  });

  it('shows a success message once sent', () => {
    render(
      <EmergencyButton
        status="sent"
        errorMessage=""
        disabled={false}
        disabledReason=""
        onPress={vi.fn()}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByText(/help is on the way/i)).toBeInTheDocument();
  });

  it('shows the error message and calls onRetry when retry is clicked', () => {
    const onRetry = vi.fn();

    render(
      <EmergencyButton
        status="error"
        errorMessage="Could not send emergency alert. Check your connection and try again."
        disabled={false}
        disabledReason=""
        onPress={vi.fn()}
        onRetry={onRetry}
      />,
    );

    expect(
      screen.getByText('Could not send emergency alert. Check your connection and try again.'),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
