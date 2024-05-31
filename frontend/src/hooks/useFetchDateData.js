import { useState, useEffect } from "react";
import { getAvailableDates } from "../services/dateService";

// const useFetchDateData = () => {
//   const [dates, setDates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     getAvailableDates()
//       .then((data) => {
//         setDates(data);
//         setError(null);
//       })
//       .catch((error) => {
//         console.error("Failed to fetch dates:", error);
//         setError(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return { dates, loading, error };
// };
const useFetchDateData = (machineNumber, titleKeyword) => {
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchDates = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const data = await getAvailableDates(machineNumber, titleKeyword);
              setDates(data);
              console.log("Retrieved dates:", data); 
          } catch (err) {
              setError('Failed to fetch available dates');
              console.error(err);
          }
          setIsLoading(false);
      };

      fetchDates();
  }, [machineNumber, titleKeyword]); // Reacts to changes in machineNumber, including null/undefined

  return { dates, isLoading, error };
};

export default useFetchDateData;
