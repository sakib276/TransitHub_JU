
/**
 * @file Provides the passenger complaint form.
 */

import { useState } from "react";

import ComplaintCategorySelector from "./complaint-category-selector";
import ComplaintDescription from "./complaint-description";
import ComplaintRelatedRide from "./complaint-related-ride";
import ComplaintSubmitButton from "./complaint-submit-button";

import { validateComplaint } from "../services/complaint-service";

/**
 * Renders the passenger complaint submission form.
 *
 * The form allows passengers to select a complaint category,
 * optionally associate the complaint with a ride, provide a
 * description, and submit the complaint.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onSubmit - Callback invoked with
 * valid complaint data.
 * @returns {JSX.Element} Passenger complaint form.
 */
function ComplaintForm({ onSubmit }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [relatedRide, setRelatedRide] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handles complaint form submission.
   *
   * @param {SubmitEvent} event - Form submission event.
   * @returns {void}
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const complaintData = {
      category,
      description,
      relatedRide,
    };

    const validationResult = validateComplaint(complaintData);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    if (typeof onSubmit === "function") {
      onSubmit(complaintData);
    }

    setIsSubmitting(false);
  };

  return (
    <form
      className="complaint-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <ComplaintCategorySelector
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
        }}
      />

      {errors.category && (
        <p className="complaint-form__error">
          {errors.category}
        </p>
      )}

      <ComplaintRelatedRide
        value={relatedRide}
        onChange={(event) => {
          setRelatedRide(event.target.value);
        }}
      />

      <ComplaintDescription
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
      />

      {errors.description && (
        <p className="complaint-form__error">
          {errors.description}
        </p>
      )}

      <ComplaintSubmitButton
        isSubmitting={isSubmitting}
      />
    </form>
  );
}

export default ComplaintForm;
