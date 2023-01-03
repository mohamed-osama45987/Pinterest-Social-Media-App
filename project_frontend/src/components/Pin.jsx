import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // generate unique id using uuid dep
import { urlFor, client } from "../client";
import { fetchUser } from "../utils/fetchUser";

import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

function Pin({ pin: { image, destination, postedBy, _id, save } }) {
  const [postHovered, setPostHovered] = useState(false); // to make our pin in hovered mood and to make a custom hover mood

  const navigate = useNavigate();

  //get user saved posts

  const user = fetchUser();

  const alreadySaved = !!save?.filter((item) => item.postedBy._id === user.sub)
    ?.length; // [2:39:00]

  // save post to user saved posts [2:46:00]
  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload(true); //reload the window on save
        });
    }
  };

  // delete pin

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out "
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        <img
          src={urlFor(image).width(250).url()} // constructing image url from sanity cdn
          alt="user-post"
          className="rounded-lg w-full"
        />

        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              {/* custom dowload button  */}

              <div className="flex gap-2">
                <a
                  href={`${image?.asset.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()} // to allow our download button to prevent the browser from redirecting to pin details page [2:34:00]
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center test-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {/* save buttons [2:35:00] */}

              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  Save
                </button>
              )}
            </div>

            {/* website hosting the image button (bottom left one) */}

            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 opacity-70 rounded-full hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />

                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}

              {postedBy?._id === user.sub && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    deletePin(_id);
                  }}
                  type="button"
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* user profile section */}
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          src={postedBy?.image}
          alt="user-profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-semibold capitalize ">{postedBy?.userName}</p>
      </Link>
    </div>
  );
}

export default Pin;
