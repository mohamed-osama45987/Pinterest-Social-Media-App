import { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { SideBar, UserProfile } from "../components";
import Pins from "./Pins";
import { userQuery } from "../utils/data";
import { client } from "../client";
import logo from "../assets/logo.png";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  const [ToggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  // accessing user info form local storage
  const userInfo = fetchUser();

  useEffect(() => {
    // fetching user data
    const query = userQuery(userInfo?.sub);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userInfo]);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col h-screen duration-75 ease-out transition-height md:flex-row bg-gray-50">
      <div className="flex-initial hidden h-screen md:flex">
        <SideBar user={user && user} />
      </div>

      {/* Mobile menu */}
      <div className="flex flex-row md:hidden">
        {/* mobile Navbar */}
        <div className="flex flex-row items-center justify-between w-full p-2 shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />

          <Link to="/">
            <img src={logo} alt="Logo" className="w-28" />
          </Link>

          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} alt="User Profile Pic" className="w-28" />
          </Link>
        </div>

        {/* actual mobile sidebar menu */}
        {ToggleSidebar && (
          <div className="fixed z-10 w-4/5 h-screen overflow-y-auto bg-white shadow-md animate-slideIn">
            <div className="absolute flex items-center justify-end w-full p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>

            <SideBar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      {/* images grid for each user  */}
      <div className="flex-1 h-screen pb-2 overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
