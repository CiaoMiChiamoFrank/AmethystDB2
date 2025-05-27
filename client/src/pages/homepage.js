import React, { useState, useEffect, useContext} from "react";
import Header from "./header";
import Footer from "./footer";
import sfondo from "../assets/cavern_amethyst.png";
import { FaArrowUp} from "react-icons/fa";
import { AccountContext } from "../context/AccountContext";

//pagina principale senza login
function Homepage() {
  const [opacity, setOpacity] = useState(0.8); // Opacità per lo sfondo
  const [showScrollTop, setShowScrollTop] = useState(false); // Mostra il bottone "Scroll-to-Top"
  const { isOnline } = useContext(AccountContext);

  
  // Gestione dell'opacità dello sfondo durante lo scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      let newOpacity = 0.8 - (scrollPosition / maxScroll) * 0.7;
      newOpacity = Math.max(0.2, newOpacity); // Limitiamo l'opacità tra 0.2 e 0.8
      setOpacity(newOpacity);
      setShowScrollTop(scrollPosition > 200); // Mostra il bottone "Scroll-to-Top" se si scrolla oltre 200px
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

useEffect(() => {
  console.log("SEI ONLINE HOMEPAGE?:", isOnline)
}, []);

  // Funzione per scrollare verso l'alto
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className=" min-h-screen flex flex-col bg-gradient-to-b from-blue-300 to-gray-200">
  <Header />

<div className="mb-10">
  {/* sezione immagine inizio pagina */}
  <div className="relative w-full h-screen ">
    <div
      className="absolute top-0 left-0 w-full h-screen bg-cover bg-center z-0"
      style={{
        backgroundImage: `url(${sfondo})`,
        opacity: opacity,
      }}
    >
      {/* svg curve sopra */}
      <svg
        className="w-full absolute top-0"
        viewBox="0 40 1000 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#fff"
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,181.3C1248,203,1344,213,1392,218.7L1440,224V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>

      {/* svg curve sotto */}
      <svg
        className="w-full absolute bottom-0"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#fff"
          d="M0,224L48,213.3C96,203,192,181,288,170.7C384,160,480,160,576,170.7C672,181,768,203,864,218.7C960,235,1056,245,1152,245.3C1248,245,1344,235,1392,229.3L1440,224V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>

    {/* scritta sopra l'immagine */}
    <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
      <h1 className="bg-white bg-gradient-to-r from-gray-300 to-slate-300 p-1 shadow-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-pridi font-bold mb-4 drop-shadow-md text-purple-400">
        BENVENUTI IN AMETHYST!
      </h1>
      <p className="font-charm text-base sm:text-lg md:text-xl lg:text-xl max-w-xl sm:max-w-2xl mb-6 drop-shadow-md text-white">
        Entra in un mondo nelle mani della libertà.
      </p>
    </div>
  </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="animate-bounce fixed bottom-10 left-10 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

  </div>
  <Footer />
</div>

  );
}

export default Homepage;
