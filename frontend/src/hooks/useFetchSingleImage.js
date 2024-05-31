import { useState, useEffect } from "react";
import { getSingleData } from "../services/imageServiceSingle";

const useFetchSingleImage = (imageId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSingleData(imageId);
        setData(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (imageId) {
      // Only run the fetch if imageId is provided
      fetchData();
    }
  }, [imageId]); // Add imageId as a dependency

  return { data, loading, error };
};

export default useFetchSingleImage;
