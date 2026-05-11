import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {
    const captainToken = localStorage.getItem('captainToken')

    const navigate = useNavigate()


    React.useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
            headers: {
                Authorization: `Bearer ${captainToken}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('captainToken')
                navigate('/captain-login')
            }
        }).catch((err) => {
            console.error("Captain logout error:", err.message);
            // Even if server fails, we should clear token and redirect
            localStorage.removeItem('captainToken');
            navigate('/captain-login');
        })
    }, [captainToken, navigate]);

    return (
        <div>CaptainLogout</div>
    )
}

export default CaptainLogout







// logout k loye hme
//1. token lao
// 2. backend me call kro logout ko axios se
//3. if respose is positive then remove token and navigate to the login page