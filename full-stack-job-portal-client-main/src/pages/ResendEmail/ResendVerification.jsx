import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const ResendVerification = () => {
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/resend-verification",
                { email: data.email }
            );

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: response?.data?.message || "Verification email has been resent.",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data?.message || "Failed to resend verification email.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Resend Verification Email</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: true })}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Resend Email"}
                </button>
            </form>
        </div>
    );
};

export default ResendVerification;