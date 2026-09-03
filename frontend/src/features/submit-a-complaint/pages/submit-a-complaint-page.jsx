
/**
 * @file Provides the passenger submit-a-complaint page.
 */
import { submitComplaint } from "../services/complaint-service";
import "../styles/complaint.css";
import ComplaintForm from "../components/complaint-form";

/**
 * Renders the submit-a-complaint page.
 *
 * The page provides a heading, complaint form,
 * preview states, and complaint status timeline.
 *
 * @returns {JSX.Element} Submit-a-complaint page.
 */
function SubmitAComplaintPage() {
  /**
   * Handles a successfully submitted complaint.
   *
   * @param {Object} complaintData - Submitted complaint data.
   * @returns {void}
   */
  /**
 * Submits complaint data to the backend API.
 *
 * @param {Object} complaintData - Complaint information.
 * @returns {Promise<Object>} Created complaint.
 */
  const handleComplaintSubmit = async (complaintData) => {
    const complaint = await submitComplaint(complaintData);

    console.log("Complaint submitted:", complaint);

    return complaint;
  };

  return (
    <main className="complaint-page">
      <section className="complaint-page__header">
        <h1>Submit a Complaint</h1>

        <p>
          Tell us what happened. We'll look into it and keep
          you updated here.
        </p>
      </section>

      <section className="complaint-preview">
        <span className="complaint-preview__label">
          PREVIEW STATE
        </span>

        <button
          type="button"
          className="complaint-preview__option complaint-preview__option--active"
        >
          Default
        </button>

        <button
          type="button"
          className="complaint-preview__option"
        >
          Missing fields
        </button>

        <button
          type="button"
          className="complaint-preview__option"
        >
          Connection dropped
        </button>

        <button
          type="button"
          className="complaint-preview__option"
        >
          Submitted
        </button>
      </section>

      <section className="complaint-layout">
        <ComplaintForm onSubmit={handleComplaintSubmit} />

        <aside className="complaint-next">
          <div className="complaint-next__header">
            <h2>What happens next</h2>
          </div>

          <div className="complaint-timeline">
            <div className="complaint-timeline__item complaint-timeline__item--completed">
              <div className="complaint-timeline__icon">
                ✓
              </div>

              <div className="complaint-timeline__content">
                <h3>Submitted</h3>

                <p>
                  You'll get a unique ID and confirmation instantly.
                </p>
              </div>
            </div>

            <div className="complaint-timeline__item">
              <div className="complaint-timeline__icon">
                ◉
              </div>

              <div className="complaint-timeline__content">
                <h3>Under Review</h3>

                <p>
                  An admin looks into what happened.
                </p>
              </div>
            </div>

            <div className="complaint-timeline__item">
              <div className="complaint-timeline__icon">
                ◉
              </div>

              <div className="complaint-timeline__content">
                <h3>Resolved / Dismissed</h3>

                <p>
                  You'll see the outcome in My Complaints.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default SubmitAComplaintPage;
