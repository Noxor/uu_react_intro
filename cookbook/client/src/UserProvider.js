import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const savedValue = JSON.parse(sessionStorage.getItem('isAuthorized'));
    const [isAuthorized, setIsAuthorized] = useState(savedValue ?? false); //probably not needed, null is also false

    const changeAuthorization = (loggedIn) => {
        setIsAuthorized(loggedIn);
        sessionStorage.setItem('isAuthorized', JSON.stringify(loggedIn));
    }

    const value = { isAuthorized, changeAuthorization };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;