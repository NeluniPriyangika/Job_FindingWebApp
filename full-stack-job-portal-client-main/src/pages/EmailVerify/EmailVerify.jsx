import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/shared/Navbar";

const EmailVerify = () => {
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("");
    const { id, token } = useParams();
    
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                console.log(`Verifying email with ID: ${id} and token: ${token}`);
                
                const response = await axios.get(
                    `http://localhost:3000/api/v1/auth/me/${id}/verify/${token}`
                );
                
                setStatus("success");
                setMessage(response.data.message || "Email verified successfully");
            } catch (error) {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage(error.response?.data?.message || "Invalid or expired verification link");
            }
        };

        if (id && token) {
            verifyEmail();
        } else {
            setStatus("error");
            setMessage("Missing verification parameters");
        }
    }, [id, token]);

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    {status === "loading" && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600">Verifying your email...</p>
                        </div>
                    )}
                    
                    {status === "success" && (
                        <div>
                            <div className="text-green-500 text-5xl mb-4">✓</div>
                            <h2 className="text-2xl font-bold text-green-600 mb-2">Verification Successful</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <Link 
                                to="/login" 
                                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                    
                    {status === "error" && (
                        <div>
                            <div className="text-red-500 text-5xl mb-4">✗</div>
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <div className="space-y-3">
                                <Link 
                                    to="/resend-verification" 
                                    className="block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors"
                                >
                                    Resend Verification Email
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="block text-primary hover:underline"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerify;