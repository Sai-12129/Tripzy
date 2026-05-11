import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

const CaptainLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const { captain, setCaptain } = useContext(CaptainDataContext)


  const submitHandler = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!email.trim() || !password.trim()) {
      toast.warning('Please enter both email and password')
      return
    }

    const captain = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

      if (response.status == 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('captainToken', data.captainToken)
        toast.success('Login successful!')
        navigate('/captain-home')
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          toast.error('Incorrect email or password')
        } else if (err.response.status === 400) {
          toast.error(err.response.data?.message || 'Invalid credentials')
        } else {
          toast.error('Something went wrong. Please try again.')
        }
      } else {
        toast.error('Unable to connect to server. Check your internet.')
      }
    }

    setEmail('')
    setPassword('')
  }


  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 h-20 mb-3 ' src="/2.png" alt='' />

        <form onSubmit={(e) => { submitHandler(e) }}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            className='bg-[#eeeeee]  mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email" placeholder='email@example.com' />

          <h3 className='text-lg font-medium mb-2'>Enter password</h3>
          <div className="relative mb-7">
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base pr-10'
              type={showPassword ? 'text' : 'password'}
              placeholder='password'
            />
            {/* 👁 single black eye icon */}
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff color="gray" size={20} /> : <Eye color="black" size={20} />}
            </button>
          </div>

          <button type="submit" className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base cursor-pointer hover:bg-[#333] transition-colors'>
            Login
          </button>
        </form>
        <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>

      </div>
      <div>
        <Link to='/login'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base '>
          Sign in as User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin