import { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

function PinDetails({ user }) {
  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const { pinId } = useParams(); // came from the url parameter inside container/pins

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId); // get our pin form sanity

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetails(data[0]);

        if (data[0]) {
          const secondQuery = pinDetailMorePinQuery(data[0]); // other pins inside the same category for this pin

          client.fetch(secondQuery).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinId]);

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  if (!pinDetails) {
    return <Spinner message={"Loading pin.."} />;
  }

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetails?.image && urlFor(pinDetails.image).url()}
            alt="user-post"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>

        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetails.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()} // to allow our download button to prevent the browser from redirecting to pin details page [2:34:00]
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center test-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={pinDetails.destination}
              target="_blank"
              rel="noopener noreferrer"
            >
              {pinDetails.destination}
            </a>
          </div>
          <div>
            <h1 className="test-4xl font-bold break-words mt-3">
              {pinDetails.title}
            </h1>
            <p className="mt-3">{pinDetails.about}</p>
          </div>

          {/* user profile section  */}
          <Link
            to={`user-profile/${pinDetails.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              src={pinDetails.postedBy?.image}
              alt="user-profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-semibold capitalize ">
              {pinDetails.postedBy?.userName}
            </p>
          </Link>

          {/* comments section  */}
          <h2 className="mt-5 text-2xl">Comments</h2>

          <div className="max-h-370 overflow-y-auto">
            {/* get all comments */}
            {pinDetails?.comments?.map((comment, i) => {
              return (
                // single comment
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                  key={i}
                >
                  <img
                    src={comment.postedBy.image}
                    alt="user-profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-col ">
                    <p className="font-bold">{comment.postedBy.userName}</p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* create comment section  */}

          <div className="flex flex-wrap mt-6 gap-3 ">
            <Link to={`user-profile/${pinDetails.postedBy?._id}`}>
              <img
                src={pinDetails.postedBy?.image}
                alt="user-profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </Link>

            <input
              type="text"
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2x mt-8 mb-4">
            More like this
          </h2>

          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message={"Loading more pins"} />
      )}
    </>
  );
}

export default PinDetails;
