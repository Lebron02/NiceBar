import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

import { Button } from "@/components/ui/button"

import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();

    const navLinks = [
        {
            name: 'Home',
            url: '/'
        },
        {
            name: 'Konto',
            url: '/account'
        },
    ]

    return (
        <div className="w-full flex items-center justify-center min-h-[100px] bg-gray-400">
            <div className="lg:container mx-auto w-full px-5">
                <div className="flex items-center justify-between w-full">
                    <div className='className="scroll-m-20 text-center text-6xl tracking-tight text-balance py-10"'>
                        <Link to={'/'}>Nicebar</Link>
                    </div>
                    <nav className='hidden md:flex items-center gap-12'>
                        {
                            navLinks?.map((page, index) => (
                                <NavLink key={index} to={page?.url} className={({isActive}) => 
                                isActive ? 'text-lg text-gray-200 font-medium capitalize' : 'text-lg text-black font-medium capitalize'
                                }>{page?.name}</NavLink>
                            ))
                        }
                        <div className="">
                            {
                                isLoggedIn ? (
                                    <Link to='/'><Button onClick={logout}>Wyloguj się</Button></Link>    
                                ) : (
                                    <Link to='/login'><Button>Zaloguj się</Button></Link>
                                )}
                        </div>
                    </nav>
                    <div className='md:hidden block'>
                        <button onClick={()=> setIsOpen(!isOpen)} className='bg-none border-0 cursor-pointer'>
                        {
                            isOpen ? <IoMdClose size={'1.8rem'} className='text-black'/> : 
                            <FaBars size={'1.8rem'} className='text-black' />
                        }
                        </button>
                    </div>
                
                    
                </div>
                {
                    isOpen && (
                    <div className={`md:hidden`}>
                        <div className='mobile_menu'>
                        <nav className='flex flex-col justify-center items-center gap-4'>
                            {
                                navLinks?.map((page, index) => (
                                    <NavLink key={index} to={page?.url} className={({isActive}) => 
                                    isActive ? 'text-lg text-gray-200 font-medium capitalize' : 'text-lg text-black font-medium capitalize'
                                    }>{page?.name}</NavLink>
                                ))
                            }
                            <div className="">
                            {
                                isLoggedIn ? (
                                    <div >
                                        <Link to='/'><Button onClick={logout}>Wyloguj się</Button></Link>
                                    </div>
                                        
                                ) : (
                                    <Link to='/login'><Button>Zaloguj się</Button></Link>
                                )}
                        </div>
                        </nav>
                    </div>
                    </div>
                    )
                }
            </div>
        </div>
        )
    }

export default Navbar;

