/**
 * @file Provides the passenger submit-a-complaint page.
 */

import ComplaintForm from '../components/complaint-form';

/**
 * Renders the submit-a-complaint page.
 *
 * The page provides a heading and displays the
 * passenger complaint form.
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
  const handleComplaintSubmit = (complaintData) => {
    console.log('Complaint submitted:', complaintData);
  };

  return (
    <main className="submit-complaint-page">
      <section className="submit-complaint-page__content">
        <h1>Submit a Complaint</h1>

        <p className="submit-complaint-page__description">
          Tell us about your experience so we can help
          improve the service.
        </p>

        <ComplaintForm
          onSubmit={handleComplaintSubmit}
        />
      </section>
    </main>
  );
}

export default SubmitAComplaintPage;