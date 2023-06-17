import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import '@fontsource/rhodium-libre';
import { arrayAI } from './dataAI';
import { arrayReal } from './dataReal';
import { db, firebase } from './firebase';

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

console.log(shuffledLimericks)

console.log("arrayAI", arrayAI.length)
console.log("arrayReal", arrayReal.length)



const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const Title = styled('h1')({
  fontSize: '42px',
  marginBottom: '16px',

});

const Score = styled('p')({
  fontSize: '18px',
  marginBottom: '8px',
});

const LimerickContainer = styled('div')({
  width: '100%',
  textAlign: 'center',
  marginBottom: '16px',
});

const LimerickText = styled('p')({
  fontSize: '16px',
  color: 'white',
  whiteSpace: 'pre-line',
  margin : 0
});

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '16px',
});

const ChooseButton = styled(Button)({
  fontSize: '14px',
  padding: '8px 16px',
  margin: '0 8px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.3)',
  },
});

const ModalContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#242424'
});

const ModalTitle = styled('h2')({
  fontSize: '24px',
  marginBottom: '16px',
  color: 'white',
  fontWeight: '900',
});

const RestartButton = styled(Button)({
  fontSize: '14px',
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.3)',
  },
});

function App() {
  const [score, setScore] = useState(0);
  const [currentLimerick, setCurrentLimerick] = useState([]);
  const [nextLimerick, setNextLimerick] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const [higherScore, setHigherScore] = useState(0);
  const [lowerScore, setLowerScore] = useState(0);



  


const pickLimericks = () => {
  const currentLimerickIndex = Math.floor(Math.random() * limericks.length);
  const currentLimerick = shuffledLimericks[currentLimerickIndex];
  let nextLimerickIndex;

  if (currentLimerick.isAI) {
    // Current limerick is AI, so next limerick should be real
    const realLimericks = shuffledLimericks.filter((limerick) => !limerick.isAI);
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
}, [score, gameOver,higherScore,lowerScore]);

  const handleLower = () => {
  if (nextLimerick?.isAI > currentLimerick?.isAI) {
    setLowerScore(lowerScore + 1);
    setScore(score + 1);
    saveScoreToFirestore(score + 1);
    
  } else {
    setScore(0);
    setGameOver(true);
    saveScoreToFirestore(0);
  }
  
  pickLimericks();
};

const handleHigher = () => {
  if (nextLimerick?.isAI < currentLimerick?.isAI) {
     setHigherScore(higherScore + 1);
    setScore(score + 1);
    saveScoreToFirestore(score + 1);
   
  } else {
    setScore(0);
    setGameOver(true);
    saveScoreToFirestore(0);
  }
  
  pickLimericks();
};

    

  const handleRestartGame = () => {
    setScore(0);
    setGameOver(false);
    pickLimericks();
  };

  const saveScoreToFirestore = (score) => {
  // Get the current authenticated user
  const currentUser = firebase.auth().currentUser;

  if (currentUser) {
    const userId = currentUser.uid;

    // Save the score to Firestore
    db.collection('scores').doc(userId).set({ score });
  }
};

console.log("Higher",currentLimerick?.isAI === 1 ? 'AI' : 'Real',"Lower",nextLimerick?.isAI === 1 ? 'AI' : 'Real');


  return (
    <Container>
      <Title >A Game of Limericks</Title>
      <Score>Identify which one is generated by AI</Score>
      <Score>Score: {score}</Score>
     <LimerickContainer>
      <LimerickText>Higher Score: {higherScore} (Score obtained from clicking Higher)</LimerickText>
      <LimerickText>Lower Score: {lowerScore} (Score obtained from clicking Lower)</LimerickText>
    </LimerickContainer>
      {currentLimerick && nextLimerick && (
        <>
          <LimerickContainer>
            <LimerickText>{currentLimerick.text} 
</LimerickText>
          </LimerickContainer>
          <ButtonContainer>
            <ChooseButton onClick={handleHigher}>Higher</ChooseButton>
            <ChooseButton onClick={handleLower}>Lower</ChooseButton>
          </ButtonContainer>
          <LimerickContainer>
            <LimerickText>{nextLimerick.text}</LimerickText>

          </LimerickContainer>
        </>
      )}
      {gameOver && (
        <Dialog open={gameOver} onClose={handleRestartGame} >
          <DialogTitle style={{backgroundColor:'#242424'}}>
            <ModalContainer>
              <ModalTitle>Game Over!</ModalTitle>
              <DialogActions>
                <RestartButton onClick={handleRestartGame}>Restart</RestartButton>
              </DialogActions>
            </ModalContainer>
          </DialogTitle>
        </Dialog>
      )}
    </Container>
  );
}

export default App;
