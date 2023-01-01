import React from "react";
import { urlFor } from "../client";

function Pin({ pin: { image, destination, postedBy } }) {
  return (
    <div>
      <img
        src={urlFor(image).width(250).url()} // constructing image url from sanity cdn
        alt="user-post"
        className="rounded-lg w-full"
      />
    </div>
  );
}

export default Pin;
