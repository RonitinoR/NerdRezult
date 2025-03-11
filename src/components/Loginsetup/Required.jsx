"use client";
import React from "react";
import styles from "./Required.css";

const Required = () => {
  // Form Header Component
  const FormHeader = () => {
    return (
      <header className={styles.headerContainer}>
        <h1 className={styles.formTitle}>Contact Form</h1>
        <p className={styles.formSubtitle}>
          Please fill out the information below
        </p>
      </header>
    );
  };

  // Form Input Component
  const FormInput = ({ label, type = "text", placeholder, isDropdown = false }) => {
    return (
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>{label}</label>
        {isDropdown ? (
          <div className={styles.selectWrapper}>
            <input
              type={type}
              placeholder={placeholder}
              className={styles.inputField}
            />
            <svg
              className={styles.dropdownIcon}
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L8 9L15 1"
                stroke="#E2E8F0"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </div>
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            className={styles.inputField}
          />
        )}
      </div>
    );
  };

  // Submit Button Component
  const SubmitButton = () => {
    return (
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton}>Submit</button>
      </div>
    );
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <main className={styles.container}>
        <section className={styles.formCard}>
          <FormHeader />
          <form>
            <FormInput label="Name" placeholder="Enter your name" />
            <FormInput
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <FormInput
              label="Phone Number"
              type="tel"
              placeholder="Enter your Phone"
            />
            <FormInput
              label="Role"
              placeholder="Enter your Role"
              isDropdown={true}
            />
            <SubmitButton />
          </form>
        </section>
      </main>
    </>
  );
};

export default Required;
