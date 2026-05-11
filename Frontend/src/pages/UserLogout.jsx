import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
    const userToken = localStorage.getItem('userToken')
    const navigate = useNavigate()

    React.useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }

        }).then((Response) => {
            if (Response.status == 200) {
                localStorage.removeItem('userToken')
                navigate('/login')
            }
        }).catch((err) => {
            console.error("User logout error:", err.message);
            // Even if server fails, we should clear token and redirect
            localStorage.removeItem('userToken');
            navigate('/login');
        })
    }, [userToken, navigate]);

    return (
        <div>UserLogout</div>
    )
}

export default UserLogout