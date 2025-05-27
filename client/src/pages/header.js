import React, { useState, useEffect, useContext} from "react";
import Logo from "../assets/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { AccountContext } from "../context/AccountContext"; 
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { useAlert } from '../context/AlertContext';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); 
  const {isOnline, setIsOnline } = useContext(AccountContext);
  const { showAlert } = useAlert();

  // effetto scrollamento per il controllo della discesa
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  
  const goToLoginPage = () => {
    navigate('/login')
  };

  const goToSignupPage = () => {
    navigate('/register')
  };

  const handleHomepage = () => {
    navigate('/')
  };

  const handleDashboard = () => {
    navigate('/dashboard')
  };

  const handleProfile = () => {
    navigate('/profile')
  };





  const handle_logout= () => {
    // Rimuovi il token JWT dal localStorage
    localStorage.removeItem("jwtToken");

      fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(data => {
          console.log("Server response:", data);
      })
      .catch(error => {
        showAlert("Errore durante il logout, riprova!", "errore");

          console.error("Errore durante il logout dal server:", error);
      });
      
      setIsOnline(false);

      showAlert("Logout effettuato con successo, a presto!", "successo");

    navigate("/");
  };
  
  return (
    <header
      className={`${
        scrolled
          ? "bg-purple-100 bg-opacity-95 shadow-lg drop-shadow-md opacity-90"
          : "bg-purple-200 shadow-2xl drop-shadow-xl scale-100 opacity-100 rounded-b-md"
      } fixed top-0 left-0 w-full h-[70px] z-50 transition-all duration-500 ease-in-out`}
    >
      <div
        className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-4 flex-wrap"
      >
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-[40px] h-10 transform transition-transform duration-500 ease-in-out hover:scale-110 rounded-full">
            <img
              className="hover:opacity-80 duration-300 cursor-pointer"
              onClick={handleHomepage}
              src={Logo}
              alt="Amethyst Logo"
            />
          </div>
          <h2
            className={`ml-4 text-2xl md:text-4xl font-charm font-bold transition-colors duration-100 ${
              scrolled ? "text-purple-500" : "text-black"
            }`}
          >
            Amethyst
          </h2>
        </div>

        {/* Menu + Buttons */}
        <div className="flex flex-wrap items-center justify-center mt-4 md:mt-0">
          {isOnline ? (
            <>
              {/* User Icon */}
              <div className="flex items-center mr-4">
                <button
                  className={`mr-2 transition-transform duration-500 ${
                    scrolled ? "scale-90" : "scale-100"
                  }`}
                >
                  <FaUserCircle
                    className="text-purple-500 drop-shadow-sm hover:drop-shadow-lg transition-all duration-300"
                    size={32}
                    onClick={handleProfile}
                  />
                </button>
              </div>

              {/* Dashboard Icon */}
              <div className="flex items-center mr-4">
                <button
                  className={`mr-2 transition-transform duration-500 ${
                    scrolled ? "scale-90" : "scale-100"
                  }`}
                >
                  <RiDashboardHorizontalFill
                    className="text-purple-500 drop-shadow-sm hover:drop-shadow-lg transition-all duration-300"
                    size={32}
                    onClick={handleDashboard}
                  />
                </button>
              </div>

              {/* Logout */}
              <button
                className={`bg-purple-500 rounded-lg px-3 py-2 text-sm md:text-lg font-bold transition-transform duration-500 ease-in-out font-pridi ${
                  scrolled ? "hover:scale-95" : "hover:scale-105"
                } shadow-md hover:shadow-lg`}
                onClick={handle_logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <button
                className={`mr-4 text-sm md:text-lg font-bold transition-colors duration-500 font-pridi ${
                  scrolled ? "text-purple-700" : "text-gray-500"
                } hover:drop-shadow-lg transition-all duration-300`}
                onClick={goToLoginPage}
              >
                Login
              </button>

              {/* Sign Up */}
              <button
                className={`bg-purple-500 rounded-lg px-3 py-2 text-sm md:text-lg font-bold transition-transform duration-500 ease-in-out font-pridi ${
                  scrolled ? "hover:scale-95" : "hover:scale-105"
                } shadow-md hover:shadow-lg`}
                onClick={goToSignupPage}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;
