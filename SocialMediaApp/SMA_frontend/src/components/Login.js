import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import shareVideo from "../assets/share.mp4";
import logoWhite from "../assets/logo-no-background.png";
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
      <div className="flex justify-start items-center flex-col h-screen">
        <div className="relative w-full h-full">
          <video
            className="w-full h-full object-cover"
            src={shareVideo}
            typeof="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
          ></video>

          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className="mb-8">
              <img src={logoWhite} width={229} alt="logoWhite" />
            </div>
            <div className="shadow-2xl">
              {user ? (
                <div>LoggedIn</div>
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
    </GoogleOAuthProvider>
  );
};

export default Login;
