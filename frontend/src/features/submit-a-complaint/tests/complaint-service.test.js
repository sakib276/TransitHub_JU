import { describe, expect, it } from 'vitest';

import {
  COMPLAINT_CATEGORY,
  validateComplaint,
} from '../services/complaint-service';

describe('validateComplaint', () => {
  it('Passenger accepts a valid complaint with a related ride', () => {
    const complaintData = {
      category: COMPLAINT_CATEGORY.DRIVER,
      relatedRideId: 'RIDE-001',
      description: 'The driver did not follow the assigned route.',
    };

    expect(validateComplaint(complaintData)).toEqual({
      isValid: true,
      errors: {},
    });
  });

  it('Passenger accepts a valid general complaint without a related ride', () => {
    const complaintData = {
      category: COMPLAINT_CATEGORY.SERVICE,
      relatedRideId: '',
      description: 'The transport service was delayed.',
    };

    expect(validateComplaint(complaintData)).toEqual({
      isValid: true,
      errors: {},
    });
  });

  it('Passenger rejects a complaint when the category is missing', () => {
    const complaintData = {
      category: '',
      relatedRideId: 'RIDE-001',
      description: 'The driver did not follow the assigned route.',
    };

    expect(validateComplaint(complaintData)).toEqual({
      isValid: false,
      errors: {
        category: 'Complaint category is required.',
      },
    });
  });

  it('Passenger rejects a complaint when the description is missing', () => {
    const complaintData = {
      category: COMPLAINT_CATEGORY.DRIVER,
      relatedRideId: 'RIDE-001',
      description: '',
    };

    expect(validateComplaint(complaintData)).toEqual({
      isValid: false,
      errors: {
        description: 'Complaint description is required.',
      },
    });
  });

  it('Passenger rejects a complaint when the description contains only spaces', () => {
    const complaintData = {
      category: COMPLAINT_CATEGORY.DRIVER,
      relatedRideId: 'RIDE-001',
      description: '   ',
    };

    expect(validateComplaint(complaintData)).toEqual({
      isValid: false,
      errors: {
        description: 'Complaint description is required.',
      },
    });
  });

  it('Passenger rejects a complaint when the complaint data is missing', () => {
    expect(validateComplaint()).toEqual({
      isValid: false,
      errors: {
        category: 'Complaint category is required.',
        description: 'Complaint description is required.',
      },
    });
  });
});