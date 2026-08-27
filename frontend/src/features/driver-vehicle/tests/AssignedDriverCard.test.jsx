import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AssignedDriverCard from '../components/AssignedDriverCard';

describe('AssignedDriverCard', () => {
  it('shows driver name, vehicle details, and plate number', () => {
    render(
      <AssignedDriverCard
        driver={{
          driverName: 'Karim Mia',
          driverPhoto: 'https://i.pravatar.cc/150?img=12',
          vehicleType: 'Rickshaw',
          vehicleColor: 'Green',
          plateNumber: 'JU-RIK-101',
        }}
      />,
    );

    expect(screen.getByText('Karim Mia')).toBeInTheDocument();
    expect(screen.getByText('Green Rickshaw')).toBeInTheDocument();
    expect(screen.getByText('JU-RIK-101')).toBeInTheDocument();
    expect(screen.getByAltText("Photo of Karim Mia")).toBeInTheDocument();
  });
});
