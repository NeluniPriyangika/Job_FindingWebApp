import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../assets/media/success.png";
import styles from "./emailVerify.css"; // Assuming you're using CSS modules

const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const { id, token } = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try {
                setLoading(true);
                // Make sure this URL matches your backend route
                const url = `${process.env.FRONTEND_URL}/verify-email/${result._id}/verify/${token.token}`;
                const { data } = await axios.get(url);
                
                setValidUrl(true);
                setMessage(data.message || "Email verified successfully");
            } catch (error) {
                console.error("Verification error:", error);
                setValidUrl(false);
                setMessage(error.response?.data?.message || "Invalid verification link");
            } finally {
                setLoading(false);
            }
        };
        
        verifyEmailUrl();
    }, [id, token]);

    if (loading) {
        return (
            <div className={styles.container}>
                <h1>Verifying your email...</h1>
                <div className={styles.loader}></div>
            </div>
        );
    }

    return (
        <div className={styles.emailveryfycontainer }>
            {validUrl ? (
                <>
                    <img src={success} alt="success_img" className={styles.success_img} />
                    <h1>{message}</h1>
                    <Link to="/login">
                        <button className={styles.green_btn}>Login</button>
                    </Link>
                </>
            ) : (
                <>
                    <h1>{message}</h1>
                    <p>The verification link is invalid or has expired.</p>
                    <Link to="/login">
                        <button className={styles.green_btn}>Go to Login</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default EmailVerify;