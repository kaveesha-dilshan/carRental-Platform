import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {

  const{setShowLogin, user, logout, isOwner, axios, setIsOwner} = useAppContext()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const changeRole = async ()=>{
    try {
      const { data } = await axios.post('/api/owner/change-role')
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === '/' ? 'bg-light' : ''
      }`}
    >
      <Link to="/">
        <img src={assets.logo} alt="logo" className="h-8" />
      </Link>

      {/* navigation + search */}
      <div
        className={`fixed top-16 right-0 h-screen w-full flex flex-col sm:static sm:h-auto sm:w-auto sm:top-auto sm:flex sm:flex-row
          sm:items-center gap-4 sm:gap-8 p-4 sm:p-0 transition-all duration-300 z-50 ${
            location.pathname === '/' ? 'bg-light' : 'bg-white'
          } ${open ? 'translate-x-0' : 'translate-x-full'} sm:translate-x-0`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        {/* Search: visible on lg and up */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="h-4 w-4" />
        </div>

        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
            <button onClick={()=> isOwner ?  navigate('/owner') : changeRole()} className="cursor-pointer">{isOwner ? 'Dashboard' : 'List cars'}</button>
            <button onClick={()=> {user ? logout() : setShowLogin(true)}} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg">{user ? 'Logout' : 'Login'}</button>
        </div>
      </div>

      <button className='sm:hidden cursor-pointer' aria-label="Menu" onClick={()=> setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>  

    </div>
  )
}

export default Navbar
