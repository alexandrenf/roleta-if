import React, { useState } from 'react';
import { PrizeProvider } from './PrizeContext';
import { Checkboxes } from './Checkboxes';
import { WheelComponent } from './Wheel';
import { HeatButton } from './HeatButton';
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';
import styled from 'styled-components';
import logo from './logo-if.png';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #014f8c 0%, #2980b9 100%);
  font-family: 'Poppins', sans-serif;

  @media (max-width: 760px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Logo = styled.img`
  height: auto;
  max-height: 80px;
  padding: 10px 20px;
  object-fit: contain;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    max-height: 70px;
    padding: 10px 10px;
  }

  @media (max-width: 570px) {
    max-height: 60px;
    padding: 5px 10px;
  }
`;

const ErrorMessage = styled.div`
  background: #e74c3c;
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.div`
  background: #3498db;
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

function App() {
  const [readyToSpin, setReadyToSpin] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createUser = useMutation(api.users.createUser);

  const handleReadyToSpin = async (formData) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Create user in Convex (only name and email, Instagram follows are just for frontend validation)
      const userId = await createUser({
        name: formData.name,
        email: formData.email,
      });
      
      // Store user data for the wheel component
      setUserData({
        userId,
        name: formData.name,
        email: formData.email,
      });
      
      setReadyToSpin(true);
    } catch (err) {
      setError(err.message || 'Erro ao registrar usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToCheckboxes = () => {
    setReadyToSpin(false);
    setWheelSpinning(false);
    setUserData(null);
    setError('');
  };

  return (
    <PrizeProvider>
      <AppContainer>
        <Logo src={logo} alt="Logo" />
        <Title>Roleta de Prêmios COBEM 2024</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isLoading && <LoadingMessage>Registrando usuário...</LoadingMessage>}

        {!readyToSpin ? (
          <Checkboxes onReadyToSpin={handleReadyToSpin} />
        ) : (
          <WheelComponent 
            onReset={resetToCheckboxes} 
            setWheelSpinning={setWheelSpinning} 
            userData={userData}
          />
        )}

        <HeatButton disabled={wheelSpinning} />
      </AppContainer>
    </PrizeProvider>
  );
}

export default App;
