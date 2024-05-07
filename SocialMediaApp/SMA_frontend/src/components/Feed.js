import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useParams } from "react-router-dom";
import { feedQuery, searchQuery } from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";

const Feed = () => {
  const [loader, setLoader] = useState(false);
  const [pins, setPins] = useState();
  const { categoryId } = useParams();
  useEffect(() => {
    setLoader(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        console.log("catdata", data);
        setLoader(false);
      });
    } else {
      const query = feedQuery();
      client.fetch(query).then((data) => {
        setPins(data);
        console.log("data", data);
        setLoader(false);
      });
    }
  }, [categoryId]);

  if (loader)
    return <Spinner message="We are adding new ideas to your feed!" />;

  return (
    <div>
      <MasonryLayout pins={pins} />
    </div>
  );
};

export default Feed;
