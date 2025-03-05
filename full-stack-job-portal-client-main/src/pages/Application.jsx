import React from "react";
import styled from "styled-components";

import Navbar from "../components/shared/Navbar";
import PaginationCom from "../components/AllJobsPage/PaginationCom";

const Application = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted!");
    };

    return (
        <>
            <Navbar />
            <Wrapper>
                <FormWrapper>
                    <h2>Job Application</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                placeholder="Enter your address"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="coverLetter">Cover Letter</label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                placeholder="Write your cover letter here"
                                rows="5"
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="note">Note</label>
                            <textarea
                                id="note"
                                name="note"
                                placeholder="Any additional notes"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cv">Upload CV (Optional)</label>
                            <input
                                type="file"
                                id="cv"
                                name="cv"
                                accept=".pdf,.doc,.docx"
                            />
                            <p className="hint">
                                You can upload a new CV or use the one you uploaded during registration.
                            </p>
                        </div>

                        <button type="submit" className="submit-btn">
                            Submit Application
                        </button>
                    </form>
                </FormWrapper>
                <PaginationCom />
            </Wrapper>
        </>
    );
};

const Wrapper = styled.section`
    padding: 2rem 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;

const FormWrapper = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;

    h2 {
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .form-group {
        margin-bottom: 1.5rem;

        label {
            display: block;
            font-size: 1rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #555;
        }

        input[type="text"],
        input[type="tel"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            color: #333;
            transition: border-color 0.3s ease;

            &:focus {
                border-color: #007bff;
                outline: none;
            }
        }

        textarea {
            resize: vertical;
        }

        input[type="file"] {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            color: #333;
        }

        .hint {
            font-size: 0.875rem;
            color: #777;
            margin-top: 0.5rem;
        }
    }

    .submit-btn {
        background: #007bff;
        color: #fff;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s ease;

        &:hover {
            background: #0056b3;
        }
    }
`;

export default Application;