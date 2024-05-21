import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import shareVideo from "../assets/share.mp4";
import logoWhite from "../assets/logo_bgTransparent_lighttheme.png";
import { jwtDecode } from "jwt-decode";
import { client } from "../client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const user = false;
  const responseGoogle = (response) => {
    const decoder = jwtDecode(response.credential);
    console.log(decoder);
    localStorage.setItem("user", JSON.stringify(decoder));
    const { name, picture, sub } = decoder;
    // sub is the unique id per user
    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    };
    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
      <div className="flex justify-start md:flex-row flex-col h-screen">
        <div className="relative w-full h-full">
          <video
            className="w-full h-full object-cover"
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
          ></video>

          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-black bg-opacity-70">
            <div className="bg-white rounded-xl flex flex-col shadow-lg w-4/5 md:w-1/3 lg:w-1/4 p-8">
              <div className="flex justify-center mb-5">
                <img src={logoWhite} width={140} alt="ArtPho Logo" />
              </div>
              <h2 className="font-bold text-3xl text-center mb-3 text-gray-800">
                Welcome to ArtPho
              </h2>
              <p className="text-center text-base text-gray-600 mb-6">
                Discover a world of stunning photography and inspiring moments.
                <br />
                Let's get lost in the beauty of images together.
              </p>
              <div className="flex justify-center">
                {user ? (
                  <div className="font-bold text-center text-gray-800">
                    Logged In
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={responseGoogle}
                    onError={() => console.log("Error")}
                  ></GoogleLogin>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
