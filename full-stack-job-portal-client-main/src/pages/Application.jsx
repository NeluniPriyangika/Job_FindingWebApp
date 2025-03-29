import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import Navbar from "../components/shared/Navbar";
import PaginationCom from "../components/AllJobsPage/PaginationCom";
import { useUserContext } from "../context/UserContext";
import { postHandler } from "../utils/FetchHandlers"; // Ensure this import is correct

const Application = () => {
    
    const { id} = useParams();
    const { user } = useUserContext();
    const navigate = useNavigate();

    // State for job details and form data
    const [job, setJobDetails] = useState(null);
    const [formData, setFormData] = useState({
        fullName: user?.name || "",
        phoneNumber: "",
        email: user?.email || "",
        address: "",
        coverLetter: "",
        note: "",
        cv: null
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch job details when component mounts
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                if (!id) {
                    throw new Error("Job ID is missing");
                }
                
                setIsLoading(true);
                const response = await axios.get(
                    `http://localhost:3000/api/v1/jobs/${id}`, 
                    { withCredentials: true }
                );
                // Change this line:
                setJobDetails(response.data.result); // Use result instead of job
            } catch (error) {
                console.error("Error fetching job details:", error);
                let errorMessage = "Could not fetch job details. Please try again.";
                
                if (error.response) {
                    errorMessage = error.response.data.message || errorMessage;
                } else if (error.request) {
                    errorMessage = "No response from server. Please check your connection.";
                } else {
                    errorMessage = error.message || errorMessage;
                }
                
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    // Apply method 
    const handleApply = async () => {
        // Ensure job details are loaded and valid
        if (!job) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Job details are not available. Please try again."
            });
            return;
        }

        let currentDate = new Date();
        let date = currentDate.toISOString().slice(0, 10);

        const appliedJob = {
            applicantId: user?._id,
            recruiterId: job.createdBy, // Get recruiter ID from job details
            jobId: id,
            status: "pending",
            dateOfApplication: date,
            resume: user?.resume || "",
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            address: formData.address,
            coverLetter: formData.coverLetter,
            note: formData.note || ""
        };

        try {
            const response = await postHandler({
                url: `http://localhost:3000/api/v1/jobs/${id}/apply`,
                body: appliedJob,
            });

            Swal.fire({
                icon: "success",
                title: "Hurray...",
                text: response?.data?.message,
            }).then(() => {
                navigate('/dashboard/applicant');
            });
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error?.response?.data?.error[0].msg,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error?.response?.data,
                });
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form data
        if (!user?._id) {
            Swal.fire({
                icon: "error",
                title: "Login Required",
                text: "Please log in to submit an application"
            });
            return;
        }

        // Call the apply method
        await handleApply();
    };

    // Show loading state
    if (isLoading) {
        return (
            <>
                <Navbar />
                <Wrapper>
                    <div>Loading job details...</div>
                </Wrapper>
            </>
        );
    }

    return (
        <>
        <Navbar />
        <Wrapper>
            <FormWrapper>
                <h2>Job Application for {job?.position}</h2>
                <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
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
                                value={formData.phoneNumber}
                                onChange={handleChange}
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
                                value={formData.email}
                                onChange={handleChange}
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
                                value={formData.address}
                                onChange={handleChange}
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
                                value={formData.coverLetter}
                                onChange={handleChange}
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
                                value={formData.note}
                                onChange={handleChange}
                            ></textarea>
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