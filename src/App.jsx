import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import '@fontsource/rhodium-libre';
import { arrayAI } from './dataAI';
import { arrayReal } from './dataReal';
import { db, firebase } from './firebase';

const limericks = [
   ...arrayAI.map((limerick) => ({ text: limerick, isAI: 0 }))
 , ...arrayReal.map((limerick) => ({ text: limerick, isAI: 1 }))
];

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
  marginBottom: '32px',
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
  const [currentLimerick, setCurrentLimerick] = useState(null);
  const [nextLimerick, setNextLimerick] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  

 console.log(limericks);


  useEffect(() => {
    pickLimericks();
  }, []);

const pickLimericks = () => {
  const currentLimerickIndex = Math.floor(Math.random() * limericks.length);
  let nextLimerickIndex = Math.floor(Math.random() * limericks.length);

  while (nextLimerickIndex === currentLimerickIndex) {
    nextLimerickIndex = Math.floor(Math.random() * limericks.length);
  }

  setCurrentLimerick(limericks[currentLimerickIndex]);
  setNextLimerick({ ...limericks[nextLimerickIndex], isAI: 1 - limericks[currentLimerickIndex].isAI });
};

  const handleHigher = () => {
    if (nextLimerick.isAI > currentLimerick.isAI) {
      const newScore = score + 1;
      setScore(newScore);
       saveScoreToFirestore(newScore);
    } else {
      setScore(0);
      setGameOver(true);
    }
    pickLimericks();
  };

  const handleLower = () => {
    if (nextLimerick.isAI < currentLimerick.isAI) {
       const newScore = score + 1;
      setScore(newScore);
      saveScoreToFirestore(newScore);
    } else {
      setScore(0);
      setGameOver(true);
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

  return (
    <Container>
      <Title >A Game of Limericks</Title>
      <Score>Score: {score}</Score>
      {currentLimerick && nextLimerick && (
        <>
          <LimerickContainer>
            <LimerickText>{currentLimerick.text}</LimerickText>
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
