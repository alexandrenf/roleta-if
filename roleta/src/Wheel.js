import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import styled from 'styled-components';
import { usePrize } from './PrizeContext';
import Particles from 'react-tsparticles';

// Styled components for layout with a modern look
const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  background: linear-gradient(135deg, #f6f9fc, #e9efff);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
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
  color: #333;
  text-align: center;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
`;

const WheelContainerHeader = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
`;

// Data array with alternating colors for each prize option
const alternatingColors = [
  { backgroundColor: '#014F8C', textColor: '#ffffff' }, // Blue with white text
  { backgroundColor: '#00963C', textColor: '#ffffff' }, // Green with white text
  { backgroundColor: '#FAC800', textColor: '#000000' }  // Yellow with black text
];

const data = [
  { option: 'Bag' },
  { option: 'Copo' },
  { option: 'Caneta' },
  { option: 'Caderno' },
  { option: 'Kit' },
  { option: 'Tente Novamente' }
].map((item, index) => ({
  ...item,
  style: {
    backgroundColor: alternatingColors[index % 3].backgroundColor,
    textColor: alternatingColors[index % 3].textColor,
  }
}));

export const WheelComponent = ({ onReset }) => {
  const { prizes, decreasePrizeCount } = usePrize();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [wonPrize, setWonPrize] = useState('');
  const [showParticles, setShowParticles] = useState(false);

  const calculatePrizeWeights = () => {
    let availablePrizes = [];
    let totalStock = 0;

    // Calculate the total stock for available prizes
    Object.keys(prizes).forEach((key) => {
      if (key !== 'tenteNovamente' && prizes[key] > 0) {
        totalStock += prizes[key];
      }
    });

    // If no stock, fallback to "Tente Novamente"
    if (totalStock === 0) {
      return [{ option: 'Tente Novamente', weight: 1.0 }];
    }

    // Assign weights based on stock ratio and ensure "Tente Novamente" is always included with 10% weight
    Object.entries(prizes).forEach(([prizeKey, quantity]) => {
      if (prizeKey === 'tenteNovamente') {
        availablePrizes.push({ option: 'Tente Novamente', weight: 0.1 });
      } else if (quantity > 0) {
        const weight = (quantity / totalStock) * 0.9; // Distribute remaining 90% among real prizes
        availablePrizes.push({ option: prizeKey, weight });
      }
    });

    return availablePrizes;
  };

  const getRandomPrize = (weightedPrizes) => {
    const randomNumber = Math.random();
    let accumulatedWeight = 0;

    for (let i = 0; i < weightedPrizes.length; i++) {
      accumulatedWeight += weightedPrizes[i].weight;
      if (randomNumber <= accumulatedWeight) {
        return weightedPrizes[i].option;
      }
    }

    return 'Tente Novamente';
  };

  const handleSpinClick = () => {
    const weightedPrizes = calculatePrizeWeights();
    const selectedPrize = getRandomPrize(weightedPrizes);

    const originalIndex = data.findIndex(
      (prize) => prize.option.toLowerCase().replace(' ', '') === selectedPrize.toLowerCase().replace(' ', '')
    );

    if (originalIndex === -1) {
      return;
    }

    setPrizeIndex(originalIndex);
    setMustSpin(true);
  };

  const handleSpinEnd = () => {
    const won = data[prizeIndex]?.option || 'Tente Novamente';
    setWonPrize(won);
    if (won !== 'Tente Novamente') {
      decreasePrizeCount(won.replace(' ', '').toLowerCase());
    }
    setMustSpin(false);
    setShowParticles(true);
    setTimeout(() => {
      setShowParticles(false);
    }, 3000);
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
        data={data}
        onStopSpinning={handleSpinEnd}
        backgroundColors={['#014F8C', '#00963C', '#FAC800']}
        textColors={['#ffffff', '#ffffff', '#000000']}
        outerBorderColor={'#000'}
        outerBorderWidth={5}
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
