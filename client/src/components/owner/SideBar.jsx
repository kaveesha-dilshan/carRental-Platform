import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../Context/AppContext';
import toast from 'react-hot-toast';

const SideBar = () => {

    const {user, axios, fetchUser} = useAppContext()
    const location = useLocation()
    const [image, setImage] = useState('')

    const updateImage = async ()=> {
        try {
            const formData = new FormData()
            formData.append('image', image)

            const {data} = await axios.post('/api/owner/update-image', formData)

            if(data.success){
                fetchUser()
                toast.success(data.message)
                setImage('')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message )
        }
    }

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>

        <div className='group relative'>
            <label htmlFor="image">
                <img src={image ? URL.createObjectURL(image) : user?.image || "https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-1/523841211_732648996070715_166223191672472567_n.jpg?stp=cp0_dst-jpg_s40x40_tt6&_nc_cat=100&ccb=1-7&_nc_sid=1d2534&_nc_ohc=tv3tBCp-F_MQ7kNvwFvZhAl&_nc_oc=AdlYeA9nEYo1-f6Y1i_7diMjxiq0Kqwlxhz93TRjkMpuUNO8lXVAIXU-6g6aJSlX5WI&_nc_zt=24&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=TymJUV71X0iE1GJ-jREJCw&oh=00_Afkk3VAAuQPs7R8OjN93P1i2T0sdNUS-9FEe7z8i5rLTZg&oe=694FEF9E"} alt="" 
                className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto'/>
                <input type="file" id = 'image' accept="image/*" hidden onChange={e=> setImage(e.target.files[0])} />

                <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
                    <img src={assets.edit_icon} alt="" />
                </div>
            </label>
        </div>
        {image && (
            <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer' onClick={updateImage}>
                Save <img src={assets.check_icon} width={13} alt="" />
            </button>
        )}
        <p className='mt-2 text-base max-md:hidden'>
            {user?.name}
        </p>

        <div className='w-full'>
            {ownerMenuLinks.map((link, index)=>(
                <NavLink key = {index} to = {link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray'}`}>
                    <img src={link.path === location.pathname ? link.coloredIcon : link.icon} alt="car icon" />
                    <span className='max-md:hidden'>{link.name}</span>
                    <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded right-0 absolute`}></div>
                </NavLink>
            ))}
            
        </div>

    </div>
  )
}

export default SideBar