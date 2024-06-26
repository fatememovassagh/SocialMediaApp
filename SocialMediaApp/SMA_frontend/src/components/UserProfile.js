import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { client } from "../client";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { googleLogout, GoogleOAuthProvider } from "@react-oauth/google";
import { AiOutlineLogout } from "react-icons/ai";
import MasonryLayout from "./MasonryLayout";

const UserProfile = () => {
  const randomImage = "https://source.unsplash.com/1600x900/?nature";
  const notActiveBtnStyles =
    "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-non";
  const activeBtnStyles =
    "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-non";
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();
  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => setPins(data));
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinsQuery).then((data) => setPins(data));
    }
  }, [text, userId]);
  const logoutUser = () => {
    navigate("/login");
    localStorage.removeItem("user");
  };
  if (!user) {
    return <Spinner message="Loading profile..." />;
  }
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
      <div className="relative pb-2 h-full justify-center items-center ">
        <div className="flex flex-col pb-5 ">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                alt="banner-pic"
                className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                src={randomImage}
              />
              <img
                className="rounded-full w-20 h-20  -mt-10 shadow-xl object-cover"
                src={user?.image}
                alt="user-pic"
              />
              <h1 className="font-bold text-3xl mt-3 text-center">
                {user.userName}
              </h1>
              <div className="absolute  z-1 right-0 p-2">
                {userId === user._id && (
                  <button
                    type="button"
                    className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                    onClick={() => {
                      googleLogout();
                      logoutUser();
                    }}
                  >
                    <AiOutlineLogout className="accent-red-700" fontSize={21} />
                  </button>
                )}
              </div>
            </div>
            <div className="text-center mb-7">
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("created");
                }}
                className={`${activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles}`}
              >
                Created
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("saved");
                }}
                className={`${activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles}`}
              >
                Saved
              </button>
            </div>
            {pins?.length ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No Pins found!
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default UserProfile;
