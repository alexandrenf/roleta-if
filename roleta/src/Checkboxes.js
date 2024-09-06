import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for better presentation
const CheckboxContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #007bb5;
  }
`;

const CheckboxInput = styled.input`
  margin-right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4caf50; /* Custom checkbox color */
  transition: transform 0.2s ease;

  &:checked {
    transform: scale(1.2);
  }
`;

const ReadyButton = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    background-color: #45a049;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

export const Checkboxes = ({ onReadyToSpin }) => {
  const [checkboxes, setCheckboxes] = useState({
    insta1: false,
    insta2: false,
    insta3: false,
  });

  // Check if all checkboxes are selected
  const allChecked = checkboxes.insta1 && checkboxes.insta2 && checkboxes.insta3;

  // Handle checkbox change event
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes({ ...checkboxes, [name]: checked });
  };

  return (
    <CheckboxContainer>
      <Label>
        <CheckboxInput 
          type="checkbox" 
          name="insta1" 
          onChange={handleChange} 
        />
        Estou seguindo a @ifmsabrazil no Instagram
      </Label>

      <Label>
        <CheckboxInput 
          type="checkbox" 
          name="insta2" 
          onChange={handleChange} 
        />
        Estou seguindo @ifmsabrazilintercambios no Instagram
      </Label>

      <Label>
        <CheckboxInput 
          type="checkbox" 
          name="insta3" 
          onChange={handleChange} 
        />
        Estou seguindo @ifmsabrazilexchanges no Instagram
      </Label>

      {/* Ready to Spin button */}
      <ReadyButton disabled={!allChecked} onClick={onReadyToSpin}>
        Vamos Girar!
      </ReadyButton>
    </CheckboxContainer>
  );
};
