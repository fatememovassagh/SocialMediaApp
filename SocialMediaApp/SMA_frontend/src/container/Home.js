import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Pins from "./Pins";
import { HiMenu } from "react-icons/hi";
import { Link, Route, Routes } from "react-router-dom";
import logo from "../assets/ArtoPho.png";
import { userQuery } from "../utils/data";
import { client } from "../client";
import { AiFillCloseCircle } from "react-icons/ai";
import UserProfile from "../components/UserProfile";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  const userInfo = fetchUser();

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    const query = userQuery(userInfo?.sub);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userInfo?.sub]);

  useEffect(() => {
    return () => {
      scrollRef.current.scrollTo(0, 0);
    };
  }, []);

  return (
    <div className="flex md:flex-row flex-col transition-height bg-gray-50 h-screen duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial ">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} className="w-28" alt="logo" />
          </Link>

          <Link to={`/User-Profile/${user?._id}`}>
            <img src={user?.image} className="w-28" alt="logo" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto transition-height shadow-md z-10">
            <div className="absolute w-full flex justify-end items-center p-2 animate-slide-in">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeSidebar={setToggleSidebar} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path={`/UserProfile/:userId`} element={<UserProfile />} />
          <Route path={`/*`} element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};
export default Home;
