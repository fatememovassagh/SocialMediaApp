import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/ArtoPho.png";
import { AiFillHome } from "react-icons/ai";
import { FcNext } from "react-icons/fc";

const isNotActiveStyle =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center  px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";
const Sidebar = ({ user, closeSidebar }) => {
  const categories = [
    { name: "Animals" },
    { name: "Nature" },
    { name: "Books" },
    { name: "Wallpapers" },
    { name: "Others" },
  ];
  const CloseSidebarHandler = () => {
    if (closeSidebar) {
      closeSidebar(false);
    }
  };
  return (
    <div className="flex felx-col bg-white h-full overflow-y-scroll items-center min-w-210 justify-between hide-scrollbar">
      <div className="flex flex-col w-full h-full">
        <Link
          to="/"
          onClick={CloseSidebarHandler}
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5 h-full">
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={CloseSidebarHandler}
          >
            <AiFillHome />
            Home
          </NavLink>
          <h2 className="text-base 2xl:text-xl mt-2 flex items-center px-5">
            Search for Categories
          </h2>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={CloseSidebarHandler}
              key={category.name}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
        {user && (
          <Link
            to={`/User-Profile/${user?._id}`}
            className="flex my-5 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3"
            onClick={CloseSidebarHandler}
          >
            <img
              src={user?.image}
              className="w-10 h-10 rounded-full"
              alt="user-proile"
            />
            <div>{user?.userName}</div>
            <FcNext />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
