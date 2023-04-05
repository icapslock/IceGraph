import planceImg from "../images/hockey3.svg";
import logo from "../images/hamburger.svg";
import { Link } from 'react-router-dom'
import { FaRegNewspaper} from 'react-icons/fa'
import { BiLogIn } from "react-icons/bi"
import { HiCalendar } from "react-icons/hi";
import backgroundImage from '../images/bg2.jpg';


export const Landing = () => {

  const sectionStyle = {
    backgroundImage: `linear-gradient(rgba(23, 23, 23, 0.2), rgba(23, 23, 23, 0.2)), url(${backgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    height: '100vh',
  };


  return (
    <>
      <section style={sectionStyle} className="pt-32 sm:pt-40 md:pt-[10rem] h-[100vh] ">
        <div className="mx-auto px-4 sm:px-12 xl:max-w-6xl xl:px-0">
        <div style={{ width: '75px', height: '75px', position: 'absolute', top: 12, left: 12 }}>
            <img src={logo} alt="Logo" />
        </div>  
          <div className="relative">
            <h1 className="text-center text-5xl font-bold text-orange-600 dark:text-white sm:text-6xl lg:text-left lg:text-7xl">
            <span className="relative bg-gradient-to-r from-primary to-secondaryLight bg-clip-text dark:from-primaryLight dark:to-secondaryLight md:px-2 text-[#D82C18]">
            IceGraphs.
                </span>
                Visualize NHL Data
            </h1>
            <div className="relative items-center gap-12 lg:flex">
              <div className="text-center sm:mx-auto sm:w-11/12 md:mt-12 md:w-4/5 lg:mt-0 lg:mr-auto lg:w-6/12 lg:text-left">
                <p className="mt-12 text-lg text-[#676767] dark:text-gray-300 sm:text-xl">
                <p className="mt-10 text-lg text-[#676767] dark:text-gray-300 sm:text-xl font-bold" style={{ fontFamily: 'Papyrus' }}>Welcome to our NHL data visualization website!</p>

                  <p className="mt-10 text-lg text-[#676767] dark:text-gray-300 sm:text-xl font-bold" style={{ fontFamily: 'Papyrus' }}>At our website, we are passionate about bringing you the latest and most comprehensive insights on your favorite NHL teams, players, and games.
                  Our website offers a variety of features, including interactive charts and graphs, heat maps, shot maps, and much more.</p> 

                  <p className="mt-10 text-lg text-[#676767] dark:text-gray-300 sm:text-xl font-bold" style={{ fontFamily: 'Papyrus' }}>We are committed to providing you with accurate, reliable, and insightful data that you can trust. 
                  Our goal is to empower you with the tools and knowledge you need to fully appreciate the game of hockey.</p>

                  <p className="mt-10 text-lg text-[#676767] dark:text-gray-300 sm:text-xl font-bold" style={{ fontFamily: 'Papyrus' }}>Thank you for visiting our website, and we hope you enjoy your experience with us!</p>
                </p>
            
                <div class="fixed top-2 right-2 flex items-center">
                  

                  <Link to='/DataDisplay' class='px-4 py-2 bg-red-800 rounded-full mr-2 focus:outline-none focus:ring focus:ring-red-500 text-black font-bold' >
                      <FaRegNewspaper />
                  </Link>

                  <Link to='/Schedule' class='px-4 py-2 bg-red-800 rounded-full mr-2 focus:outline-none focus:ring focus:ring-red-500 text-black font-bold' >
                      <HiCalendar />  
                  </Link>

                  <Link to='/DataDisplay' class='px-4 py-2 bg-red-800 rounded-full mr-2 focus:outline-none focus:ring focus:ring-red-500 text-black font-bold' >
                      <BiLogIn />
                  </Link>
                </div>


                <div className="mt-12 hidden lg:block">
                  <div className="mt-5 hidden lg:block transform scale-[1]">
                    <div className="mt-5 grid grid-cols-3 gap-4">

                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 w-full overflow-hidden sm:mt-20 lg:-mt-8 lg:w-6/12">
                <img
                  className="w-full"
                  src={planceImg}
                  alt=""
                  height={600}
                  width={800}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </>
  );
};
export default Landing;
