import { useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
import jwt from "jwt-decode";
import { client } from "../client";

import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

const Login = () => {
  const navigate = useNavigate();

  const googleResponse = async (response) => {
    const result = await jwt(response.credential);

    localStorage.setItem("user", JSON.stringify(result));

    const { picture, name } = result;

    const doc = {
      _id: result.sub,
      _type: "user",
      userName: name,
      image: picture,
    };

    // create a user in our sanity backend
    client.createIfNotExists(doc).then(() => {
      // auto redirect the user to our home page of google sign in successfully
      navigate("/", {
        replace: true,
      });
    });
  };
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <div className="w-full h-full realtive">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="object-cover w-full h-full"
        />

        <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <div className="p-5">
            <img src={logo} alt="App Logo" width="130px" />
          </div>

          <div className="shadow-2xl ">
            <GoogleLogin
              onSuccess={googleResponse}
              onError={googleResponse}
              useOneTap={true}
              className="outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
