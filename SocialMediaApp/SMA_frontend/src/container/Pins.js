import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Route, Routes } from "react-router-dom";
import Feed from "../components/Feed";
import PinDetail from "../components/PinDetail";
import CreatePin from "../components/CreatePin";
import Search from "../components/Search";

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState();
  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
        />
      </div>
      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />}></Route>
          <Route path="/category/:categoryId" element={<Feed />}></Route>
          <Route
            path="/pinDetail/:pinId"
            element={<PinDetail user={user} />}
          ></Route>
          <Route path="/create-pin" element={<CreatePin user={user} />}></Route>
          <Route
            path="/Search"
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          ></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
