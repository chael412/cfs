import { useMemo } from "react";

const UseAppUrl = () => {
    // Define the URL constants for offline and online
    const appUrl = "http://localhost:8000";

    const API_URL = useMemo(() => {
        return appUrl;
    }, []);

    return API_URL;
};

export default UseAppUrl;
