import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import NotificationCard from './NotificationCard';

const notification = {
  notificationId: 1,
  title: 'Driver Assigned',
  message: 'A driver has been assigned to your ride.',
  status: 'unread',
  time: '10:30 AM',
};

describe('NotificationCard', () => {
  it('displays notification information', () => {
    render(
      <NotificationCard
        notification={notification}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByText('Driver Assigned')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'A driver has been assigned to your ride.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Unread')
    ).toBeInTheDocument();
  });

  it('calls onSelect when View Details is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <NotificationCard
        notification={notification}
        onSelect={onSelect}
      />
    );

    await user.click(
      screen.getByRole('button', {
        name: /view details/i,
      })
    );

    expect(onSelect).toHaveBeenCalledWith(notification);
  });
});