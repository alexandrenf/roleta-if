import React, { useState } from 'react';
import { PrizeProvider } from './PrizeContext';
import { Checkboxes } from './Checkboxes';
import { WheelComponent } from './Wheel';
import { HeatButton } from './HeatButton';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f8ff;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h1`
  font-size: 36px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
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
        <Title>Roleta de Prêmios da IFMSA Brazil</Title>

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
