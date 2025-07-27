import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [attendance, setAttendance] = useState([]);

    return (
        <UserContext.Provider value={{ user, setUser, attendance, setAttendance }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);