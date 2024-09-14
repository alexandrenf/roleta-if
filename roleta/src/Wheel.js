// WheelComponent.js
import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import styled from 'styled-components';
import { usePrize } from './PrizeContext';
import Particles from 'react-tsparticles';

// Styled components for layout with a modern look
const WheelContainer = styled.div`
  display: flex;
  background-color: #014f8c;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 40px;
  border-radius: 15px;
`;

const SpinButton = styled.button`
  margin-top: 30px;
  padding: 15px 40px;
  background-color: #ff6347;
  color: white;
  font-size: 22px;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    background-color: #ff4500;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const PrizeMessage = styled.h2`
  margin-top: 30px;
  font-size: 26px;
  color: #fff;
  text-align: center;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
`;

const alternatingColors = [
  { backgroundColor: '#00963C', textColor: '#ffffff' }, // Green with white text
  { backgroundColor: '#FAC800', textColor: '#000000' }  // Yellow with black text
];

// Wheel Component
export const WheelComponent = ({ onReset }) => {
  const { prizes, decreasePrizeCount } = usePrize();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [wonPrize, setWonPrize] = useState('');
  const [showParticles, setShowParticles] = useState(false);

  // Function to get filtered prizes and alternate colors dynamically
  const getFilteredPrizes = () => {
    const prizeEntries = Object.entries(prizes)
      .filter(([prizeKey, quantity]) => quantity > 0 && prizeKey !== 'tenteNovamente') // Filter prizes with stock
      .map(([prizeKey], index) => ({
        option: prizeKey.charAt(0).toUpperCase() + prizeKey.slice(1), // Capitalize first letter
        style: {
          backgroundColor: alternatingColors[index % 2].backgroundColor, // Apply alternating colors based on the index of filtered prizes
          textColor: alternatingColors[index % 2].textColor,
        }
      }));

    return [
      ...prizeEntries,
      {
        option: 'Tente Novamente',
        style: { backgroundColor: '#FAC800', textColor: '#000000' } // 'Tente Novamente' option
      }
    ];
  };

  const handleSpinClick = () => {
    const filteredPrizes = getFilteredPrizes();
    const randomIndex = Math.floor(Math.random() * filteredPrizes.length);
    setPrizeIndex(randomIndex);
    setMustSpin(true);
  };

  const handleSpinEnd = () => {
    const won = getFilteredPrizes()[prizeIndex]?.option || 'Tente Novamente';
    setWonPrize(won);

    if (won !== 'Tente Novamente') {
      decreasePrizeCount(won.toLowerCase());
    }
    setMustSpin(false);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);
  };

  return (
    <WheelContainer>
      {showParticles && (
        <Particles
          options={{
            particles: {
              number: { value: 100 },
              size: { value: 5 },
              move: { speed: 3 },
              line_linked: { enable: false },
              opacity: { value: 0.7 },
            },
          }}
        />
      )}

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeIndex}
        data={getFilteredPrizes()} // Use filtered prizes
        onStopSpinning={handleSpinEnd}
        backgroundColors={['#014F8C', '#00963C', '#FAC800']}
        textColors={['#ffffff', '#ffffff', '#000000']}
        outerBorderColor={'#f0f0f0'}
        outerBorderWidth={4}
        radiusLineColor={'#ddd'}
        radiusLineWidth={2}
        fontFamily={'Arial'}
        spinDuration={1.0}
      />

      {wonPrize && !mustSpin && wonPrize !== "Tente Novamente" && (
        <PrizeMessage show={!!wonPrize}>
          Parabéns, você ganhou um(a) {wonPrize}!
        </PrizeMessage>
      )}
      {wonPrize && !mustSpin && wonPrize === "Tente Novamente" && (
        <PrizeMessage show={!!wonPrize}>
          Poxa! Não foi dessa vez, tente novamente!
        </PrizeMessage>
      )}

      <SpinButton
        onClick={wonPrize ? onReset : handleSpinClick}
        disabled={mustSpin}
      >
        {mustSpin ? 'Girando...' : wonPrize ? 'Gire Novamente' : 'Gire a roleta'}
      </SpinButton>
    </WheelContainer>
  );
};
