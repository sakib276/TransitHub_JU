/**
 * @file Provides the complaint category selection component.
 */

import { COMPLAINT_CATEGORY } from '../services/complaint-service';

/**
 * Renders the complaint category selector.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.value - Currently selected category.
 * @param {Function} props.onChange - Handles category changes.
 * @returns {JSX.Element} Complaint category selector.
 */
function ComplaintCategorySelector({
  value,
  onChange,
}) {
  return (
    <div className="complaint-form__field">
      <label htmlFor="complaint-category">
        Complaint Category
      </label>

      <select
        id="complaint-category"
        value={value}
        onChange={onChange}
      >
        <option value="">Select a category</option>

        <option value={COMPLAINT_CATEGORY.DRIVER}>
          Driver
        </option>

        <option value={COMPLAINT_CATEGORY.SERVICE}>
          Service
        </option>

        <option value={COMPLAINT_CATEGORY.RIDE}>
          Ride
        </option>
      </select>
    </div>
  );
}

export default ComplaintCategorySelector;