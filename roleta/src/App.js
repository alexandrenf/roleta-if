import React, { useState } from 'react';
import { PrizeProvider } from './PrizeContext';
import { Checkboxes } from './Checkboxes';
import { WheelComponent } from './Wheel';
import { HeatButton } from './HeatButton';
import styled from 'styled-components';
import logo from './logo-if.png';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-top: 20px; /* Add some padding at the top to ensure the logo isn't clipped */
  background-color: #014f8c;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 760px) {
    padding-top: 20px; /* Reduce padding for smaller screens if necessary */
  }
`;


const Title = styled.h1`
  font-size: 36px;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
`;

const Logo = styled.img`
  height: auto;
  max-height: 80px;
  padding: 10px 20px;
  object-fit: contain;

  @media (max-width: 768px) {
    max-height: 80px; /* Adjust the size for tablets */
    padding: 10px 10px;
  }

  @media (max-width: 570px) {
    max-height: 60px; /* Further adjust the size for small screens */
    padding: 5px 10px; /* Adjust padding for very small screens */
  }
`;


function App() {
  const [readyToSpin, setReadyToSpin] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);

  const resetToCheckboxes = () => {
    setReadyToSpin(false);
    setWheelSpinning(false);
  };

  return (
    <PrizeProvider>
      <AppContainer>
        <Logo src={logo} alt="Logo" />
        <Title>Roleta de Prêmios COBEM 2024</Title>

        {!readyToSpin ? (
          <Checkboxes onReadyToSpin={() => setReadyToSpin(true)} />
        ) : (
          <WheelComponent onReset={resetToCheckboxes} setWheelSpinning={setWheelSpinning} />
        )}

        <HeatButton disabled={wheelSpinning} />
      </AppContainer>
    </PrizeProvider>
  );
}

export default App;
