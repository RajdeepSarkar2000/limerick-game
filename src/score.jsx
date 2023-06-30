import React, { useState, useEffect } from "react";
import {  collection, doc, getDocs } from "firebase/firestore";
import {db} from "./firebase";

function Score() {
  const [scores, setScores] = useState([]);

useEffect(() => {
    const fetchScoresFromFirestore = async () => {
      try {
        const scoresCollection = collection(db, "scores");
        const snapshot = await getDocs(scoresCollection);

        const scoresData = [];
        snapshot.forEach((doc) => {
          scoresData.push(doc.data());
        });

        setScores(scoresData);
      } catch (error) {
        console.error("Error fetching scores from Firestore:", error);
      }
    };

    fetchScoresFromFirestore();
  }, []);

  console.log(scores);

  return (
    <div>
      <h1>Scores</h1>
      <ul>
        {scores?.map((score) => (
          <li key={score.id}>{score.score}</li>
        ))}
      </ul>
    </div>
  );
}

export default Score;
