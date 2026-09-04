/**
 * Prominent emergency button with inline send-status feedback (FR-12.1/12.2).
 *
 * @param {Object} props - Component properties.
 * @param {string} props.status - Send status ('idle' | 'sending' | 'sent' | 'error').
 * @param {string} props.errorMessage - Error message to show when status is 'error'.
 * @param {boolean} props.disabled - Whether the button is disabled (e.g. no active trip).
 * @param {string} props.disabledReason - Message shown when disabled.
 * @param {Function} props.onPress - Called when the button is pressed.
 * @param {Function} props.onRetry - Called when the retry button is pressed.
 * @returns {JSX.Element} Emergency button with status feedback.
 */
function EmergencyButton({ status, errorMessage, disabled, disabledReason, onPress, onRetry }) {
  return (
    <div className="emergency-button-block">
      <button
        type="button"
        className="emergency-btn"
        onClick={onPress}
        disabled={disabled || status === 'sending'}
      >
        {status === 'sending' ? 'Sending Alert...' : 'Report Emergency'}
      </button>

      {disabled && (
        <p className="emergency-hint">{disabledReason}</p>
      )}

      {status === 'sent' && (
        <div className="emergency-feedback success">
          Alert sent. Help is on the way.
        </div>
      )}

      {status === 'error' && (
        <div className="emergency-feedback error">
          <p>{errorMessage}</p>
          <button type="button" className="outline-btn" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default EmergencyButton;
