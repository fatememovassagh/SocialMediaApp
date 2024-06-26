import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (searchTerm) {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      const query = feedQuery();
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="Searching for pins"></Spinner>}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && !loading && searchTerm !== "" && (
        <div className="mt-10 text-center text-xl">No pins found!</div>
      )}
    </div>
  );
};

export default Search;
