/**
 * @file Provides the optional related ride selector.
 */

/**
 * Renders the optional related ride field.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.value - Selected ride.
 * @param {Function} props.onChange - Handles ride changes.
 * @returns {JSX.Element} Related ride selector.
 */
function ComplaintRelatedRide({
  value,
  onChange,
}) {
  return (
    <div className="complaint-form__field">
      <label htmlFor="related-ride">
        Related Ride
      </label>

      <select
        id="related-ride"
        value={value}
        onChange={onChange}
      >
        <option value="">
          No specific ride
        </option>

        <option value="RIDE-001">
          Ride RIDE-001
        </option>

        <option value="RIDE-002">
          Ride RIDE-002
        </option>
      </select>
    </div>
  );
}

export default ComplaintRelatedRide;