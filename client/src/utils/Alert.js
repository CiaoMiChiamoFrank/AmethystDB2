// Alert.js
import React, { useState, useEffect } from 'react';
import { useAlert } from '../context/AlertContext';
import { IoIosCloseCircleOutline } from "react-icons/io";


const Alert = () => {
  const { alert, closeAlert } = useAlert();
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (alert) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);  // Nascondi dopo 3 secondi
      return () => clearTimeout(timer);  // Pulizia del timer
    }
  }, [alert]);

  if (!alert) return null; 

  let alertClasses = 'font-pridi text-base fixed top-5 right-5 p-4 mb-4 mt-20 text-white rounded-lg flex items-center justify-between z-[9999] border-2 max-w-xs transition-all duration-500 ease-in-out';

  // Aggiungi le classi specifiche in base al tipo di alert
  if (alert.type === 'successo') {
    alertClasses += ' bg-green-300 border-green-600';
  } else if (alert.type === 'errore') {
    alertClasses += ' bg-red-300 border-red-600';
  } else if (alert.type === 'warning') {
    alertClasses += 'text-gray-500 bg-yellow-200 border-yellow-600';
  }

  // Aggiungi gli effetti di transizione per la comparsa e la scomparsa
  alertClasses += visible ? ' opacity-100 translate-x-0' : ' opacity-0 translate-x-10';

  return (
    <div className={alertClasses}>
      <span>{alert.message}</span>
      <button
        className="ml-4 text-xl font-bold bg-transparent border-none text-white cursor-pointer"
        onClick={closeAlert}
      >
       <IoIosCloseCircleOutline size={32}/>
      </button>
    </div>
  );
};

export default Alert;
