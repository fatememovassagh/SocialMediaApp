import React, { useState } from "react";
import { client, urlFor } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { BiDownload } from "react-icons/bi";
import { fetchUser } from "../utils/fetchUser";
import { v4 as uuidv4 } from "uuid";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { IoTrashBin } from "react-icons/io5";

const Pin = ({
  pin: { image, url, destination, postedBy, title, _id, save },
}) => {
  const user = fetchUser();
  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy._id === user?.sub,
  )?.length;

  const navigate = useNavigate();
  const [postHover, setPostHover] = useState(false);
  const [savingPost, setSavingPost] = useState();
  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.sub,
            postedBy: { _type: "postedBy", _ref: user?.sub },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };
  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };
  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-2xl rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onMouseEnter={() => setPostHover(true)}
        onMouseLeave={() => setPostHover(false)}
        onClick={() => navigate(`/pin_detail/${_id}`)}
      >
        <img
          className="rounded-lg w-full"
          src={urlFor(image).width(250).url()}
          alt={title}
        />
        {postHover && (
          <div
            className="absolute top-0  w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded flex items-center justify-center opacity-75 w-9 h-9 text-xl hover:opacity-100 hover:shadow-md outline-none "
                >
                  <BiDownload />
                </a>
              </div>
              <div>
                {alreadySaved ? (
                  <button
                    type="button"
                    className="bg-blue-500  opacity-70 hover:opacity-100  text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md"
                  >
                    {/*<IoBookmark />*/}
                    {save?.length} Saved
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}
                    type="button"
                    className="bg-blue-500  opacity-70 hover:opacity-100  text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md"
                  >
                    Save
                    {/*<BiBookmark />*/}
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="flex bg-white items-center gap-2 text-black text-xs p-2 pl-4 pr-4 font-bold rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowDownCircleFill />{" "}
                  {destination.length > 20
                    ? destination.slice(8, 18)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === user?.sub ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white rounded flex items-center justify-center opacity-75 w-9 h-9 text-xl hover:opacity-100 hover:shadow-md outline-none"
                >
                  <IoTrashBin />
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
