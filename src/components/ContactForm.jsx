import { useState } from "react";

import nameIcon from "../assets/contact/icons/form-name.svg";
import emailIcon from "../assets/contact/icons/form-email.svg";
import phoneIcon from "../assets/contact/icons/form-phone.svg";
import messageIcon from "../assets/contact/icons/form-message.svg";

const initialForm = {
  name: "",
  email: "",
  number: "",
  message: "",
};

const inputClass = `
  w-full min-w-0 bg-transparent
  text-base font-medium text-[#3D3D3D]
  outline-none
  placeholder:text-[14px]
  sm:placeholder:text-[16px]
  lg:placeholder:text-[18px]
  placeholder:text-[rgba(61,61,61,0.7)]
  sm:text-lg
  lg:text-[24px]
`;
function ContactForm() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setNotice("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    const phone = formData.number.trim();
    const digits = phone.replace(/\D/g, "");

    if (!phone) {
      newErrors.number = "Please enter your phone number.";
    } else if (
      !/^\+?[\d\s()-]+$/.test(phone) ||
      digits.length < 7 ||
      digits.length > 15
    ) {
      newErrors.number = "Enter a valid phone number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setNotice("");
      return;
    }

    // TODO: Connect the form to the verified backend API.
    setNotice(
      "Your details are valid, but online submission is not available yet. Please use the contact information above."
    );
  }

  const fieldContainerClass = `
    flex min-w-0 items-center gap-[23px]
    rounded-[20px] bg-white
    px-5 sm:px-7
    focus-within:outline-2
    focus-within:outline-offset-2
    focus-within:outline-[#F87927]
  `;

  return (
    <section
      id="contact-form"
      aria-labelledby="contact-form-heading"
      className="w-full bg-white px-5 pt-6 pb-20 sm:px-8 lg:px-[4.57%] lg:pt-[10px]"
    >
      <div className="mx-auto max-w-[1580px]">

        {/* SECTION HEADING */}
        <h2
          id="contact-form-heading"
          className="mb-8 text-[28px] font-semibold text-[#233D4D] sm:text-[32px] lg:mb-[47px] lg:text-[32px]"
        >
          How can we help you?
        </h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* FIGMA FORM PANEL */}
          <div
            className="
              w-full rounded-[20px]
              bg-[#fef0e7]
              p-5 sm:p-7
              lg:p-[29px_40px_28px]
            "
          >
            <div
              className="
                grid grid-cols-1
                gap-6
                md:grid-cols-2
                lg:gap-x-[6.6%]
                lg:gap-y-[52px]
              "
            >

              {/* NAME */}
              <div className="min-w-0">
                <label htmlFor="contact-name" className="sr-only">
                  Name
                </label>

                <div className={`${fieldContainerClass} min-h-[70px] lg:h-[80px]`}>
                  <img
                    src={nameIcon}
                    alt=""
                    className="h-[26px] w-auto shrink-0"
                  />

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={inputClass}
                  />
                </div>

                {errors.name && (
                  <p id="contact-name-error" className="mt-2 text-sm text-red-700">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div className="min-w-0">
                <label htmlFor="contact-email" className="sr-only">
                  Email
                </label>

                <div className={`${fieldContainerClass} min-h-[05px] lg:h-[80px]`}>
                  <img
                    src={emailIcon}
                    alt=""
                    className="h-[23px] w-auto shrink-0"
                  />

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={inputClass}
                  />
                </div>

                {errors.email && (
                  <p id="contact-email-error" className="mt-2 text-sm text-red-700">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* NUMBER */}
              <div className="min-w-0 md:row-start-2">
                <label htmlFor="contact-number" className="sr-only">
                  Number
                </label>

                <div className={`${fieldContainerClass} min-h-[70px] lg:h-[80px]`}>
                  <img
                    src={phoneIcon}
                    alt=""
                    className="h-[26px] w-auto shrink-0"
                  />

                  <input
                    id="contact-number"
                    name="number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Number"
                    value={formData.number}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.number)}
                    aria-describedby={errors.number ? "contact-number-error" : undefined}
                    className={inputClass}
                  />
                </div>

                {errors.number && (
                  <p id="contact-number-error" className="mt-2 text-sm text-red-700">
                    {errors.number}
                  </p>
                )}
              </div>

              {/* MESSAGE */}
              <div className="min-w-0 md:col-start-2 md:row-start-2 lg:pt-4">
                <label htmlFor="contact-message" className="sr-only">
                  Say something
                </label>

                <div
                  className="
                    flex min-h-[180px] items-start gap-[23px]
                    rounded-[20px] bg-white
                    px-5 py-5 sm:px-[34px]
                    focus-within:outline-2
                    focus-within:outline-offset-2
                    focus-within:outline-[#F87927]
                    lg:h-[220px]
                  "
                >
                  <img
                    src={messageIcon}
                    alt=""
                    className="h-[26px] w-auto shrink-0"
                  />

                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Say something"
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${inputClass} h-full resize-none`}
                  />
                </div>

                {errors.message && (
                  <p id="contact-message-error" className="mt-2 text-sm text-red-700">
                    {errors.message}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* SUBMIT BUTTON — PRESERVED, PENDING FIGMA VERIFICATION */}
          <button
            type="submit"
            className="
              mt-8 flex min-h-[55px] w-full
              items-center justify-center rounded-[12px]
              bg-[#F87927] px-6
              text-xl font-semibold text-white
              transition-colors hover:bg-[#E96B1B]
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#F87927]
            "
          >
            Submit
          </button>

          {notice && (
            <p role="status" className="mt-4 text-sm text-[#233D4D]">
              {notice}
            </p>
          )}

        </form>
      </div>
    </section>
  );
}

export default ContactForm;