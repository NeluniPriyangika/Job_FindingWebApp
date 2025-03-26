import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const userContext = React.createContext();

const UserContext = ({ children }) => {
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState({ status: false, message: "" });
    const [user, setUser] = useState(null); // Initialize as null instead of {}

    const handleFetchMe = async () => {
        setUserLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:3000/api/v1/auth/me`,
                { withCredentials: true } // Rely on cookies only
            );
            
            setUser(response?.data?.user || response?.data?.result); // Adjust based on your API response
            setUserError({ status: false, message: "" });
        } catch (error) {
            setUserError({ 
                status: true, 
                message: error?.response?.data?.message || "Authentication failed" 
            });
            setUser(null);
            localStorage.removeItem("token"); // Clean up if exists
        }
        setUserLoading(false);
    };

    const logout = async () => {
        try {
            await axios.post(
                "http://localhost:3000/api/v1/auth/logout",
                {},
                { withCredentials: true }
            );
            setUser(null);
            localStorage.removeItem("token");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    useEffect(() => {
        handleFetchMe();
    }, []);

    const passing = { 
        userLoading, 
        userError, 
        user, 
        handleFetchMe,
        logout
    };
    
    return (
        <userContext.Provider value={passing}>{children}</userContext.Provider>
    );
};

const useUserContext = () => useContext(userContext);

export { useUserContext, UserContext };
