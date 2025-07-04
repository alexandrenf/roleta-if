import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for better presentation
const CheckboxContainer = styled.div`
  margin: 20px 0;
  padding: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid #e9ecef;
`;

const FormTitle = styled.h2`
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
`;

const FormSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  color: #34495e;
  font-size: 18px;
  margin-bottom: 15px;
  font-weight: 500;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bb5;
    box-shadow: 0 0 0 3px rgba(0, 123, 181, 0.1);
  }

  &.error {
    border-color: #e74c3c;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    color: #007bb5;
    background-color: #f8f9fa;
  }
`;

const CheckboxInput = styled.input`
  margin-right: 12px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #4caf50;
  transition: transform 0.2s ease;

  &:checked {
    transform: scale(1.1);
  }
`;

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  display: block;
`;

const ReadyButton = styled.button`
  margin-top: 30px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100%;

  &:disabled {
    background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    cursor: not-allowed;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
`;

export const Checkboxes = ({ onReadyToSpin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkboxes: {
      insta1: false,
      insta2: false,
      insta3: false,
      insta4: false,
    }
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Nome é obrigatório';
    if (name.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email inválido';
    return '';
  };

  // Check if all checkboxes are selected
  const { insta1, insta2, insta3, insta4 } = formData.checkboxes;
  const allChecked = insta1 && insta2 && insta3 && insta4;

  // Check if form is valid
  const nameError = validateName(formData.name);
  const emailError = validateEmail(formData.email);
  const isFormValid = !nameError && !emailError && allChecked;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      checkboxes: {
        ...prev.checkboxes,
        [name]: checked
      }
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    
    if (nameError || emailError) {
      setErrors({
        name: nameError,
        email: emailError
      });
      return;
    }

    // Only pass name and email to parent - Instagram follows are just for frontend validation
    onReadyToSpin({
      name: formData.name,
      email: formData.email
    });
  };

  return (
    <CheckboxContainer>
      <FormTitle>Participe da Roleta de Prêmios!</FormTitle>
      
      <FormSection>
        <SectionTitle>Dados Pessoais</SectionTitle>
        
        <InputGroup>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Digite seu nome completo"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </InputGroup>
      </FormSection>

      <FormSection>
        <SectionTitle>Siga nossas redes sociais *</SectionTitle>
        
        <CheckboxLabel>
          <CheckboxInput 
            type="checkbox" 
            name="insta1" 
            checked={formData.checkboxes.insta1}
            onChange={handleCheckboxChange} 
          />
          Estou seguindo a @ifmsabrazil no Instagram
        </CheckboxLabel>

        <CheckboxLabel>
          <CheckboxInput 
            type="checkbox" 
            name="insta2" 
            checked={formData.checkboxes.insta2}
            onChange={handleCheckboxChange} 
          />
          Estou seguindo @ifmsabrazilintercambios no Instagram
        </CheckboxLabel>

        <CheckboxLabel>
          <CheckboxInput 
            type="checkbox" 
            name="insta3" 
            checked={formData.checkboxes.insta3}
            onChange={handleCheckboxChange} 
          />
          Estou seguindo @ifmsabrazilexchanges no Instagram
        </CheckboxLabel>

        <CheckboxLabel>
          <CheckboxInput 
            type="checkbox" 
            name="insta4" 
            checked={formData.checkboxes.insta4}
            onChange={handleCheckboxChange} 
          />
          Estou seguindo @bmsjournal no Instagram
        </CheckboxLabel>
      </FormSection>

      <ReadyButton disabled={!isFormValid} onClick={handleSubmit}>
        Vamos Girar a Roleta! 🎯
      </ReadyButton>
    </CheckboxContainer>
  );
};
