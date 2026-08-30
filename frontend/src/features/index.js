/**
 * @file Public exports for the submit-a-complaint feature.
 */

export { default as ComplaintForm } from './components/complaint-form';

export {
  default as ComplaintCategorySelector,
} from './components/complaint-category-selector';

export {
  default as ComplaintDescription,
} from './components/complaint-description';

export {
  default as ComplaintRelatedRide,
} from './components/complaint-related-ride';

export {
  default as ComplaintSubmitButton,
} from './components/complaint-submit-button';

export {
  default as SubmitAComplaintPage,
} from './pages/submit-a-complaint-page';

export {
  COMPLAINT_CATEGORY,
  validateComplaint,
} from './services/complaint-service';