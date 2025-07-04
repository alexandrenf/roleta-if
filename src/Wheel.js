// WheelComponent.js
import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import styled from 'styled-components';
import { usePrize } from './PrizeContext';
import Particles from 'react-tsparticles';
import { useQuery } from 'convex/react';
import { api } from './convex/_generated/api';

// Styled components for layout with a modern look
const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 25px;
  border-radius: 15px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const UserName = styled.h3`
  color: #fff;
  font-size: 18px;
  margin: 0 0 5px 0;
  font-weight: 600;
`;

const UserEmail = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 0;
`;

const SpinButton = styled.button`
  margin-top: 30px;
  padding: 15px 40px;
  background: linear-gradient(135deg, #ff6347 0%, #ff4500 100%);
  color: white;
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255, 99, 71, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;

  &:disabled {
    background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    cursor: not-allowed;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 99, 71, 0.6);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  margin-top: 15px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(108, 117, 125, 0.3);

  &:disabled {
    background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    cursor: not-allowed;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 117, 125, 0.4);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
`;

const PrizeMessage = styled.div`
  margin-top: 30px;
  padding: 20px;
  font-size: 22px;
  color: #fff;
  text-align: center;
  background: ${props => props.isWinner ? 
    'linear-gradient(135deg, #00C851 0%, #00A843 100%)' : 
    'linear-gradient(135deg, #ffbb33 0%, #ff8800 100%)'
  };
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  transition: all 0.3s ease;
  opacity: ${props => props.show ? 1 : 0};
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(-10px)'};
`;

const LoadingSpinner = styled.div`
  color: white;
  font-size: 18px;
  text-align: center;
  padding: 20px;
`;

const PrizeHistory = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 20px;
  border-radius: 10px;
  margin-top: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-height: 150px;
  overflow-y: auto;
`;

const PrizeHistoryTitle = styled.h4`
  color: #fff;
  font-size: 16px;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const PrizeHistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 5px 0;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

// Wheel Component
export const WheelComponent = ({ onReset, setWheelSpinning, userData }) => {
  const { prizesForWheel, handlePrizeWin, isLoading } = usePrize();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [wonPrize, setWonPrize] = useState('');
  const [showParticles, setShowParticles] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  
  // Get user's prize history
  const userPrizeHistory = useQuery(api.users.getUserPrizeHistory, 
    userData?.userId ? { userId: userData.userId } : "skip"
  );

  // Handle wheel spinning state
  const handleSpinStart = () => {
    setWheelSpinning(true);
    setMustSpin(true);
  };

  const handleSpinClick = () => {
    if (!prizesForWheel || prizesForWheel.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * prizesForWheel.length);
    setPrizeIndex(randomIndex);
    handleSpinStart();
  };

  const handleSpinEnd = async () => {
    if (!prizesForWheel || prizesForWheel.length === 0) return;
    
    const wonPrizeData = prizesForWheel[prizeIndex];
    const prizeName = wonPrizeData?.option || 'Tente Novamente';
    
    setWonPrize(prizeName);
    setSpinCount(prev => prev + 1);
    
    // Handle prize win in database
    if (wonPrizeData && wonPrizeData.name !== 'tentenovamente') {
      await handlePrizeWin(userData, wonPrizeData.name);
    }
    
    setMustSpin(false);
    setWheelSpinning(false);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 3000);
  };

  const handleSpinAgain = () => {
    setWonPrize('');
    setShowParticles(false);
  };

  const handleNewParticipation = () => {
    setWonPrize('');
    setShowParticles(false);
    setSpinCount(0);
    onReset();
  };

  // Show loading state
  if (isLoading || !prizesForWheel) {
    return (
      <WheelContainer>
        <LoadingSpinner>Carregando roleta...</LoadingSpinner>
      </WheelContainer>
    );
  }

  // Show message if no prizes available
  if (prizesForWheel.length === 0) {
    return (
      <WheelContainer>
        <PrizeMessage show={true} isWinner={false}>
          Não há prêmios disponíveis no momento.
        </PrizeMessage>
        <SpinButton onClick={onReset}>
          Voltar ao Início
        </SpinButton>
      </WheelContainer>
    );
  }

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
              color: { value: ["#ffbb33", "#ff8800", "#00C851", "#00A843"] },
            },
          }}
        />
      )}

      {userData && (
        <UserInfo>
          <UserName>{userData.name}</UserName>
          <UserEmail>{userData.email}</UserEmail>
          {spinCount > 0 && (
            <p style={{ margin: '5px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
              Tentativas: {spinCount}
            </p>
          )}
        </UserInfo>
      )}

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeIndex}
        data={prizesForWheel}
        onStopSpinning={handleSpinEnd}
        backgroundColors={['#014F8C', '#00963C', '#FAC800']}
        textColors={['#ffffff', '#ffffff', '#000000']}
        outerBorderColor={'#f0f0f0'}
        outerBorderWidth={4}
        radiusLineColor={'#ddd'}
        radiusLineWidth={2}
        fontFamily={'Poppins'}
        spinDuration={1.2}
        fontSize={16}
      />

      {wonPrize && !mustSpin && (
        <PrizeMessage 
          show={!!wonPrize} 
          isWinner={wonPrize !== "Tente Novamente"}
        >
          {wonPrize === "Tente Novamente" ? 
            "Poxa! Não foi dessa vez, tente novamente!" : 
            `🎉 Parabéns! Você ganhou: ${wonPrize}!`
          }
        </PrizeMessage>
      )}

      <ButtonContainer>
        <SpinButton
          onClick={wonPrize ? handleSpinAgain : handleSpinClick}
          disabled={mustSpin}
        >
          {mustSpin ? 'Girando...' : wonPrize ? 'Girar Novamente' : 'Girar a Roleta'}
        </SpinButton>

        {wonPrize && (
          <SecondaryButton onClick={handleNewParticipation}>
            Nova Participação
          </SecondaryButton>
        )}
      </ButtonContainer>

      {userPrizeHistory && userPrizeHistory.length > 0 && (
        <PrizeHistory>
          <PrizeHistoryTitle>Seus Prêmios:</PrizeHistoryTitle>
          {userPrizeHistory.slice(-5).reverse().map((historyItem, index) => (
            <PrizeHistoryItem key={index}>
              <span>{historyItem.prizeName}</span>
              <span>{new Date(historyItem.timestamp).toLocaleTimeString()}</span>
            </PrizeHistoryItem>
          ))}
        </PrizeHistory>
      )}
      
    </WheelContainer>
  );
};
