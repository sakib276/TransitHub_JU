/**
 * @file Provides the complaint description input component.
 */

/**
 * Renders the complaint description field.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.value - Current description.
 * @param {Function} props.onChange - Handles description changes.
 * @returns {JSX.Element} Complaint description field.
 */
function ComplaintDescription({
  value,
  onChange,
}) {
  return (
    <div className="complaint-form__field">
      <label htmlFor="complaint-description">
        Complaint Description
      </label>

      <textarea
        id="complaint-description"
        value={value}
        onChange={onChange}
        placeholder="Describe your complaint..."
        rows="6"
      />
    </div>
  );
}

export default ComplaintDescription;