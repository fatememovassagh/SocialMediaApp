import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import { client, urlFor } from "../client";
import { BiDownload } from "react-icons/bi";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import { v4 as uuidv4 } from "uuid";
import MasonryLayout from "./MasonryLayout";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetails] = useState(null);
  const [comment, setcomment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();
  const fetchPinDetails = () => {
    setPinDetails(true);
    let query = pinDetailQuery(pinId);
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetails(data[0]);
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

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
          setcomment("");
          setAddingComment(false);
        });
    } else {
    }
  };
  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) {
    return <Spinner message="loading pin" />;
  }

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white w-fit"
        style={{ borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            style={{ maxHeight: "600px" }}
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620 ">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 itmes-center ">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded flex items-center justify-center opacity-75 w-9 h-9 text-xl hover:opacity-100 hover:shadow-md outline-none "
              >
                <BiDownload />
              </a>
            </div>
            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail?.destination}
            </a>
          </div>
          <link />
          <div>
            <h1 className="text-4xl font-bold break-words   mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-2 items-center bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>
          <h2 className="mt-5 text-2xl">comments</h2>

          <div className="flex flex-wrap mt-6 gap-3">
            <Link
              to={`user-profile/${user._id}`}
              className="flex gap-2 items-center bg-white rounded-lg"
            >
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={user.image}
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setcomment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 text-base font-semibold outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting a comment..." : "Post"}
            </button>
          </div>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail.comments?.map((comment, key) => (
              <div key={key} className="flex gap-3 mt-5 bg-white rounded-lg">
                <img
                  src={comment?.postedBy?.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p className=""> {comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-5">
            {" "}
            More like this{" "}
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <div className="mt-3 text-center">There is no related pin.</div>
      )}
    </>
  );
};

export default PinDetail;
