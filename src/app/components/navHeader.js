'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseInit";
import { FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { HiMiniWrenchScrewdriver } from "react-icons/hi2";
import { LuWrench } from "react-icons/lu";
import { FaWrench } from "react-icons/fa6";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { Dropdown } from 'flowbite-react';
import { IoIosArrowDown } from "react-icons/io";


const NavHeader = () => {
  // Logic for the logout button to appear if the user is logged in
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

    
  


// Using the useEffect hook to perform side effects in our functional component
useEffect(() => { 

    // Retrieving the user data from local storage
    const storedUser = localStorage.getItem("user");


    // If there is user data in local storage
    if (storedUser) {
        // Parse the user data from JSON and set it in the state
        setUser(JSON.parse(storedUser));
    }

    const observer = new IntersectionObserver(
        ([entry]) => {
          setIsScrolled(entry.isIntersecting);
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5, // Adjust the threshold as needed
        }
      );
  
      const target = document.getElementById('content'); // Get the content div. This is the div that will be observed
      if (target) {
        observer.observe(target);
      }
  
      return () => {
        if (target) {
          observer.unobserve(target);
        }
      };
    }, []);

  // The empty array as a second argument means this effect will only run once, similar to componentDidMount in className components


  
  

  // Removes the user from local storage and redirects to the home page
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/"); // <- Home Page/Index
  };

  

  return (

<motion.div   initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 120, duration: 0.5 }}>    
<div className="flex items-center w-screen justify-center ">
    <nav className="fixed top-5 backdrop-blur-sm bg-white/30 w-relative p-4 m-1 text-center z-50 rounded-lg" style={{ color: isScrolled ? 'black' : 'white'}}>
        <div className="flex items-center flex-shrink-0 ">
          <Link href="/">
            <Image width={40} height={70} src="/cu-logo.svg" alt="Cardiff University Logo" />
          </Link>
            <Link href="/"><span className="font-semibold text-xl tracking-tight pr-9 pl-2 transition-b duration-1000">CIREGS</span></Link>
            <div className="w-[75px]"></div>
            <Dropdown
                    arrowIcon={true}
                    inline={true}
                    label=""
                    dismissOnClick={false}
                    renderTrigger={() => (
                        <span className=" cursor-pointer hover:underline transition-b duration-1000 px-2 flex items-center">
                        Company
                        <IoIosArrowDown className="pl-1"/>
                        </span>
                    )}
                    triggerClass="bg-transparent" // Add your custom trigger class
                    menuClass="bg-transparent" // Add your custom menu class
                    >
                    <Dropdown.Item href="/team">Meet the team</Dropdown.Item>
                    <Dropdown.Item href="/feedback">Feedback</Dropdown.Item>
                </Dropdown>

                <Dropdown
                    arrowIcon={true}
                    inline={true}
                    label=""
                    dismissOnClick={false}
                    renderTrigger={() => (
                        <span className=" cursor-pointer hover:underline transition-b duration-1000 flex items-center px-2">
                        Extra
                        <IoIosArrowDown className="pl-1"/>
                        </span>
                    )}
                    triggerClass="bg-transparent" // Add your custom trigger class
                    menuClass="bg-transparent"
                    >
                    <Dropdown.Item href="https://ukerc.ac.uk/">Dataset</Dropdown.Item>
                    <Dropdown.Item href="https://www.cardiff.ac.uk/research/explore/research-units/centre-for-integrated-renewable-energy-generation-and-supply">Cardiff University</Dropdown.Item>
                    {/* <Dropdown.Item>Terms and conditions</Dropdown.Item> */}
                </Dropdown>
                {user ? (
                <div className="flex">
                    <Link href="/adminDash" className="px-2 flex justify-center items-center">
                        <h2 className=" transition-b duration-1000">Dashboard</h2>
                        <div className="transition-b duration-1000 pl-2">
                            <FaWrench/>
                        </div>
                    </Link>
                    <button onClick={handleLogout} className="flex px-2 font-normal text-right align-middle justify-center items-center">
                        <a className="transition-b duration-1000 px-1">Logout</a>
                        <div className="transition-b duration-1000">
                            <IoMdLogOut />
                        </div>
                    </button>
                </div>
            ) : (
                <Link href="/login" className={({ isActive }) => isActive ? "underline " : "inactive"}>
                    <h2 className="font-normal transition-b duration-1000 text-right align-middle pl-3">Login</h2>
                </Link>
            )}
                <div>

                </div>
        </div>
    </nav>
    
</div>
</motion.div>

  

)};



export default NavHeader;
