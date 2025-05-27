import React from "react";
import Logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';

function Footer() {

  const navigate = useNavigate(); 

  const handleHomepage = () => {
    navigate('/')
  };


  return (
    <footer className="bg-purple-200 p-4 mt-0">
      {/* Top Section */}
      <div className="flex flex-wrap justify-evenly items-center gap-6 md:gap-0 p-4 mt-0 text-black">
        {/* Left Section */}
        <div className="grid place-items-center text-center mt-4 md:mt-[50px] text-lg md:text-xl font-pridi cursor-pointer">
          <div className="hover:underline hover:scale-110 duration-500">Chi siamo</div>
          <div className="mt-4 md:mt-[30px] hover:underline hover:scale-110 duration-500">
            Contatti
          </div>
        </div>

        {/* Logo Section */}
        <div className="grid place-items-center text-center mr-8">
          <div className="w-[50px] transform transition-transform duration-500 ease-in-out hover:scale-110">
            <img
              className="hover:opacity-80 duration-300 cursor-pointer"
              onClick={handleHomepage}
              src={Logo}
              alt="Amethyst Logo"
            />
          </div>
          <div className="text-lg md:text-xl font-charm font-bold text-black mt-2">
            Amethyst
          </div>
        </div>

        {/* Right Section */}
        <div className="grid place-items-center text-center mt-4 md:mt-[50px] text-lg md:text-xl font-pridi cursor-pointer">
          <div className="hover:underline hover:scale-110 duration-500">Info</div>
          <div className="mt-4 md:mt-[30px] hover:underline hover:scale-110 duration-500">
            Politica
          </div>
        </div>
      </div>

      {/* Bottom Section (Social Icons) */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <div className="hover:scale-110 duration-500 cursor-pointer">
          <img
            className="w-8 md:w-9 h-8 md:h-9"
            src="https://www.svgrepo.com/show/521711/instagram.svg"
            alt="Instagram Icon"
          />
        </div>
        <div className="hover:scale-110 duration-500 cursor-pointer">
          <img
            className="w-8 md:w-9 h-8 md:h-9"
            src="https://www.svgrepo.com/show/447165/github-outline.svg"
            alt="GitHub Icon"
          />
        </div>
        <div className="hover:scale-110 duration-500 cursor-pointer">
          <img
            className="w-8 md:w-9 h-8 md:h-9"
            src="https://www.svgrepo.com/show/521654/facebook.svg"
            alt="Facebook Icon"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
