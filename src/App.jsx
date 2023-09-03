import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { styled } from "@mui/system";
import "@fontsource/rhodium-libre";
import { arrayAI } from "./dataAI";
import { arrayReal } from "./dataReal";
import { db } from "./firebase";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {doc,setDoc,addDoc,collection} from "firebase/firestore"

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Create the limericks array with AI and Real limericks
const limericks = [
  ...arrayAI.map((limerick) => ({ text: limerick, isAI: 1 })),
  ...arrayReal.map((limerick) => ({ text: limerick, isAI: 0 })),
];

// Shuffle the limericks array
const shuffledLimericks = shuffleArray(limericks);

console.log(shuffledLimericks);

console.log("arrayAI", arrayAI.length);
console.log("arrayReal", arrayReal.length);

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  padding: "0 20px",
  [theme.breakpoints.down("md")]: {
    padding: "0 20px",
  },
}));

const Title = styled("h1")(({ theme }) => ({
  fontSize: "42px",
  marginBottom: "16px",
  [theme.breakpoints.down("md")]: {
    fontSize: "24px",
  },
}));

const Details = styled("p")(({ theme }) => ({
  fontSize: "18px",
  marginBottom: "8px",
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    fontSize: "14px",
  },
}));

const Score = styled(Details)({
  fontWeight: "900",
  marginBottom: "24px",
  padding: "16px",
  border: "2px solid blue",
  borderRadius: "10px",
});

const LimerickContainer = styled("div")({
  width: "100%",
  textAlign: "center",
  marginBottom: "16px",
});

const LimerickText = styled("p")(({ theme }) => ({
  fontSize: "16px",
  color: "#0056b3",
  whiteSpace: "pre-line",
  margin: 0,
  [theme.breakpoints.down("md")]: {
    fontSize: "14px",
  },
}));

const ButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: "16px",
});

const ChooseButton = styled(Button)({
  fontSize: "14px",
  padding: "8px 16px",
  margin: "0 8px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
  "&:focus": {
    outline: "none",
    boxShadow: "0 0 0 3px rgba(0, 123, 255, 0.3)",
  },
});

const ModalContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#242424",
});

const ModalTitle = styled("h2")({
  fontSize: "24px",
  marginBottom: "16px",
  color: "white",
  fontWeight: "900",
});

const RestartButton = styled(Button)({
  fontSize: "14px",
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#0056b3",
  },
  "&:focus": {
    outline: "none",
    boxShadow: "0 0 0 3px rgba(0, 123, 255, 0.3)",
  },
});

function App() {
  const initialScore = parseInt(localStorage.getItem("totalScore")) || 0;
  const [score, setScore] = useState(initialScore);
  const [currentLimerick, setCurrentLimerick] = useState([]);
  const [nextLimerick, setNextLimerick] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const [higherScore, setHigherScore] = useState(0);
  const [lowerScore, setLowerScore] = useState(0);

  const [gameOverCount, setGameOverCount] = useState(0);

  console.log(higherScore, lowerScore);

  const pickLimericks = () => {
    const currentLimerickIndex = Math.floor(Math.random() * limericks.length);
    const currentLimerick = shuffledLimericks[currentLimerickIndex];
    let nextLimerickIndex;

    if (currentLimerick.isAI) {
      // Current limerick is AI, so next limerick should be real
      const realLimericks = shuffledLimericks.filter(
        (limerick) => !limerick.isAI
      );
      nextLimerickIndex = Math.floor(Math.random() * realLimericks.length);
      const nextLimerick = realLimericks[nextLimerickIndex];
      setCurrentLimerick(currentLimerick);
      setNextLimerick(nextLimerick);
    } else {
      // Current limerick is real, so next limerick should be AI
      const aiLimericks = shuffledLimericks.filter((limerick) => limerick.isAI);
      nextLimerickIndex = Math.floor(Math.random() * aiLimericks.length);
      const nextLimerick = aiLimericks[nextLimerickIndex];
      setCurrentLimerick(currentLimerick);
      setNextLimerick(nextLimerick);
    }
  };

  useEffect(() => {
    pickLimericks();
  }, [score, gameOver, higherScore, lowerScore]);

  const handleLower = () => {
    if (nextLimerick?.isAI < currentLimerick?.isAI) {
      setLowerScore(lowerScore + 1);
      setScore(score + 1);
      saveScoreToFirestore(score + 1);
    } else {
      setScore(0);
      setGameOver(true);
       setGameOverCount(gameOverCount + 1);
      // saveScoreToFirestore(0);
    }

    //   if (gameOver) {
    //   saveScoreToFirestore(score);
    // }

    pickLimericks();
  };

  const handleHigher = () => {
    if (nextLimerick?.isAI > currentLimerick?.isAI) {
      setHigherScore(higherScore + 1);
      setScore(score + 1);
      // saveScoreToFirestore(score + 1);
    } else {
      setScore(0);
      setGameOver(true);
       setGameOverCount(gameOverCount + 1);
      // saveScoreToFirestore(0);
    }

    //   if (gameOver) {
    //   saveScoreToFirestore(score);
    // }

    pickLimericks();
  };

  const Link = styled("a")({
    color: "blue",
    fontWeight: 600,
    textDecoration: "none",
  });

  const handleRestartGame = () => {
    setScore(0);
    setGameOver(false);
    pickLimericks();
  };

  // Get the current authenticated user
  const saveScoreToFirestore = async () => {
  try {
    const scoresCollection = collection(db, "scores");
    await addDoc(scoresCollection, { score });
  } catch (error) {
    console.error("Error saving score to Firestore:", error);
  }
};

const gameOverCountFirebase = async () => {
  try {
    const countCollection = collection(db, "count");
    await addDoc(countCollection, { gameOverCount });
  } catch (error) {
    console.error("Error saving score to Firestore:", error);
  }
};

useEffect(() => {
  if (gameOver) {
    saveScoreToFirestore(score); // Save the score
    gameOverCountFirebase(); // Save the game over count
  }
}, [gameOver, score]);
  console.log(
    "Higher",
    currentLimerick?.isAI === 1 ? "AI" : "Real",
    "Lower",
    nextLimerick?.isAI === 1 ? "AI" : "Real"
  );

    useEffect(() => {
    if (gameOver && score > initialScore) {
      localStorage.setItem("highestScore", score.toString());
      saveScoreToFirestore(score);
    }
  }, [gameOver]);



  return (
    <Container
      style={{
        "@media (min-width: 960px)": {
          padding: " 20px",
        },
      }}
    >
      <Title>A Turing Test for LimeGPT!</Title>
      <Details>
        Each game round pops out two limericks, one of which is from{" "}
        <Link href="https://github.com/sballas8/PoetRNN/blob/master/data/limericks.csv">
          {" "}
          Sam Ballas’ dataset of 90,000 real limericks
        </Link>{" "}
        and the other from our generative model for limericks{" "}
        <Link href="https://github.com/kunal-bhar/lime-GPT">LimeGPT</Link>.
        Guess the real limerick to beat the test 🚀
      </Details>
      <Score>Score: {score}</Score>

      {currentLimerick && nextLimerick && (
        <>
          <LimerickContainer>
            <LimerickText>{currentLimerick.text}</LimerickText>
          </LimerickContainer>

          <ButtonContainer>
            <ChooseButton onClick={handleHigher}>
              <ArrowDropUpIcon />
            </ChooseButton>
            <ChooseButton onClick={handleLower}>
              <ArrowDropDownIcon />
            </ChooseButton>
          </ButtonContainer>

          <LimerickContainer>
            <LimerickText>{nextLimerick.text}</LimerickText>
          </LimerickContainer>
        </>
      )}
      {gameOver && (
        <Dialog open={gameOver} onClose={handleRestartGame}>
          <DialogTitle style={{ backgroundColor: "#242424" }}>
            <ModalContainer>
              <ModalTitle>Game Over!</ModalTitle>
              <DialogActions>
                <RestartButton onClick={handleRestartGame}>
                  Restart
                </RestartButton>
              </DialogActions>
            </ModalContainer>
          </DialogTitle>
        </Dialog>
      )}
    </Container>
  );
}

export default App;
