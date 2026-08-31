/**
 * Priority Request Form module.
 * @module PriorityRequestForm
 */

import { useState } from "react";

/**
 * Displays a form for submitting a priority queue request.
 *
 * Passengers can select an emergency reason and upload
 * supporting proof for administrative review.
 *
 * @memberof module:PriorityRequestForm
 * @param {Object} props Component properties.
 * @param {Function} props.onSubmit Callback executed when the form is submitted.
 * @param {string|null} props.status Current priority request status.
 * @returns {JSX.Element} Priority request form.
 */
export default function PriorityRequestForm({ onSubmit, status }) {
  /** Selected emergency reason. */
  const [reason, setReason] = useState("");

  /** Uploaded supporting document or image. */
  const [proof, setProof] = useState(null);

  /**
   * Handles priority request submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} event Form submission event.
   * @returns {void}
   */
  const submit = (event) => {
    event.preventDefault();

    onSubmit({
      reason,
      proof,
      needsReview: true,
    });
  };

  return (
    <section className="queue-card">
      <div className="queue-card-heading">
        <div>
          <h2>Request priority</h2>
          <p className="card-copy">
            For verified medical or academic emergencies only.
          </p>
        </div>

        {status && (
          <span className={`queue-status-pill ${status.toLowerCase()}`}>
            {status}
          </span>
        )}
      </div>

      <form onSubmit={submit}>
        <div className="queue-form-group">
          <label htmlFor="priority-reason">Emergency reason</label>
          <select
            id="priority-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            disabled={status === "Pending"}
          >
            <option value="">Select a reason</option>
            <option>Medical emergency</option>
            <option>Academic emergency</option>
            <option>Other</option>
          </select>
        </div>

        <div className="queue-form-group">
          <label htmlFor="priority-proof">Supporting proof</label>
          <input
            id="priority-proof"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) => setProof(event.target.files[0])}
            disabled={status === "Pending"}
          />
        </div>

        <button
          className="queue-outline-btn"
          type="submit"
          disabled={status === "Pending"}
        >
          {status === "Pending"
            ? "Request pending review"
            : "Submit priority request"}
        </button>
      </form>
    </section>
  );
}