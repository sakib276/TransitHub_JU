/**
 * @file Provides the complaint submission button.
 */

/**
 * Renders the complaint submission button.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} [props.isSubmitting=false]
 * Indicates whether submission is in progress.
 * @returns {JSX.Element} Complaint submit button.
 */
function ComplaintSubmitButton({
  isSubmitting = false,
}) {
  return (
    <button
      type="submit"
      className="complaint-form__submit"
      disabled={isSubmitting}
    >
      {isSubmitting
        ? 'Submitting...'
        : 'Submit Complaint'}
    </button>
  );
}

export default ComplaintSubmitButton;