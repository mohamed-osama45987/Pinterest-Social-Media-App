import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; //in order to access the parameters inside the url

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

import { searchQuery, feedQuery } from "../utils/data";

function Feed() {
  const [loading, setLoading] = useState(false); // to change component loading state
  const [pins, setPins] = useState(null);

  const { categoryId } = useParams(); // get the category categoryId param from the url

  // fetching posts
  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      // if there is a speciefic categroy spicified
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      // get all pins whatever its category

      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  // impelement loading spinner
  if (loading) {
    return <Spinner message="Adding new ideas to your feed!" />;
  }

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
}

export default Feed;
