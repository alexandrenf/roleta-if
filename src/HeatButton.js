import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSpinner, faPlus, faTrash, faEdit, faSync } from '@fortawesome/free-solid-svg-icons';
import { usePrize } from './PrizeContext';
import { useMutation, useQuery } from 'convex/react';
import { api } from './convex/_generated/api';

// Styled components
const GearIconContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 30px;
  color: #fac800;
  transition: all 0.3s ease;
  z-index: 100;
  
  &:hover {
    color: #00c800;
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  border: 2px solid rgba(0, 0, 0, 0.1);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  backdrop-filter: blur(5px);
`;

const ModalTitle = styled.h3`
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
`;

const Button = styled.button`
  margin: 8px 4px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DangerButton = styled(Button)`
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  
  &:hover {
    box-shadow: 0 6px 12px rgba(231, 76, 60, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
  
  &:hover {
    box-shadow: 0 6px 12px rgba(52, 152, 219, 0.4);
  }
`;

const AddButton = styled(Button)`
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  box-shadow: 0 4px 8px rgba(155, 89, 182, 0.3);
  
  &:hover {
    box-shadow: 0 6px 12px rgba(155, 89, 182, 0.4);
  }
`;

const WarningButton = styled(Button)`
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  box-shadow: 0 4px 8px rgba(243, 156, 18, 0.3);
  
  &:hover {
    box-shadow: 0 6px 12px rgba(243, 156, 18, 0.4);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bb5;
    box-shadow: 0 0 0 3px rgba(0, 123, 181, 0.1);
  }
`;

const PrizeItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const PrizeInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0;
    color: #2c3e50;
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 14px;
  }
`;

const PrizeActions = styled.div`
  display: flex;
  gap: 8px;
`;

const LoadingSpinner = styled(FontAwesomeIcon)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
`;

const ActionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 15px;
`;

const MigrationSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 243, 205, 0.5);
  border-radius: 10px;
  border: 1px solid #f39c12;
`;

export const HeatButton = ({ disabled }) => {
  const { resetPrizesToDefault, isLoading } = usePrize();
  const prizes = useQuery(api.prizes.getAllPrizes);
  const updatePrizeQuantity = useMutation(api.prizes.updatePrizeQuantity);
  const addPrize = useMutation(api.prizes.addPrize);
  const removePrize = useMutation(api.prizes.removePrize);
  const runMigration = useMutation(api.migrations.removeInitialQuantityFromPrizes);
  
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPrize, setEditPrize] = useState({ name: '', quantity: 1, displayName: '' });
  const [newPrize, setNewPrize] = useState({ name: '', displayName: '', quantity: 1 });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveEditPrize = async () => {
    if (editPrize.name && editPrize.quantity >= 0) {
      setIsUpdating(true);
      try {
        await updatePrizeQuantity({
          prizeName: editPrize.name,
          quantity: parseInt(editPrize.quantity, 10),
        });
        setShowEditModal(false);
      } catch (error) {
        console.error('Error updating prize:', error);
        alert('Erro ao atualizar prêmio. Tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleAddPrize = async () => {
    if (newPrize.name && newPrize.displayName && newPrize.quantity >= 0) {
      setIsUpdating(true);
      try {
        await addPrize({
          name: newPrize.name,
          displayName: newPrize.displayName,
          quantity: parseInt(newPrize.quantity, 10),
        });
        setNewPrize({ name: '', displayName: '', quantity: 1 });
        setShowAddModal(false);
      } catch (error) {
        console.error('Error adding prize:', error);
        alert(error.message || 'Erro ao adicionar prêmio. Tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemovePrize = async (prizeId, prizeName) => {
    if (window.confirm(`Tem certeza que deseja remover o prêmio "${prizeName}"?`)) {
      setIsUpdating(true);
      try {
        await removePrize({ prizeId });
      } catch (error) {
        console.error('Error removing prize:', error);
        alert(error.message || 'Erro ao remover prêmio. Tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleResetPrizes = async () => {
    if (window.confirm('Tem certeza que deseja resetar todos os prêmios para os valores padrão?')) {
      setIsUpdating(true);
      try {
        await resetPrizesToDefault();
        setShowModal(false);
      } catch (error) {
        console.error('Error resetting prizes:', error);
        alert('Erro ao resetar prêmios. Tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRunMigration = async () => {
    if (window.confirm('Executar migração para limpar dados antigos? Esta ação irá remover campos desnecessários do banco de dados.')) {
      setIsUpdating(true);
      try {
        const result = await runMigration();
        alert(result);
      } catch (error) {
        console.error('Error running migration:', error);
        alert('Erro ao executar migração. Tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowAddModal(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <GearIconContainer onClick={() => !disabled && setShowModal(true)} disabled={disabled}>
        <FontAwesomeIcon icon={faCog} />
      </GearIconContainer>

      {showModal && (
        <>
          <Overlay onClick={handleModalClose} />
          <ModalContainer>
            <ModalTitle>🎯 Gerenciar Prêmios</ModalTitle>

            <ActionHeader>
              <h4 style={{ margin: 0, color: '#2c3e50' }}>Prêmios Cadastrados</h4>
              <AddButton onClick={() => setShowAddModal(true)} disabled={isUpdating}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                Novo Prêmio
              </AddButton>
            </ActionHeader>

            {prizes && prizes.length > 0 ? (
              prizes.map((prize) => (
                <PrizeItem key={prize._id}>
                  <PrizeInfo>
                    <h4>{prize.displayName}</h4>
                    <p>Quantidade: {prize.quantity}</p>
                  </PrizeInfo>
                  <PrizeActions>
                    <SecondaryButton 
                      onClick={() => {
                        setEditPrize({ 
                          name: prize.name, 
                          quantity: prize.quantity, 
                          displayName: prize.displayName 
                        });
                        setShowEditModal(true);
                      }}
                      disabled={isUpdating}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </SecondaryButton>
                    {prize.name !== 'tentenovamente' && (
                      <DangerButton 
                        onClick={() => handleRemovePrize(prize._id, prize.displayName)}
                        disabled={isUpdating}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </DangerButton>
                    )}
                  </PrizeActions>
                </PrizeItem>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
                Nenhum prêmio encontrado
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', borderTop: '2px solid #e9ecef', paddingTop: '20px' }}>
              <DangerButton onClick={handleResetPrizes} disabled={isUpdating}>
                {isUpdating ? <LoadingSpinner icon={faSpinner} /> : 'Resetar Prêmios'}
              </DangerButton>
              <Button onClick={handleModalClose}>Fechar</Button>
            </div>
          </ModalContainer>
        </>
      )}

      {showEditModal && (
        <>
          <Overlay onClick={handleModalClose} />
          <ModalContainer>
            <ModalTitle>✏️ Editar {editPrize.displayName}</ModalTitle>

            <FormSection>
              <Label>Quantidade:</Label>
              <Input
                type="number"
                min="0"
                placeholder="Quantidade"
                value={editPrize.quantity}
                onChange={(e) => setEditPrize({ ...editPrize, quantity: e.target.value })}
              />
            </FormSection>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={handleSaveEditPrize} disabled={isUpdating}>
                {isUpdating ? <LoadingSpinner icon={faSpinner} /> : 'Salvar'}
              </Button>
              <SecondaryButton onClick={handleModalClose}>Cancelar</SecondaryButton>
            </div>
          </ModalContainer>
        </>
      )}

      {showAddModal && (
        <>
          <Overlay onClick={handleModalClose} />
          <ModalContainer>
            <ModalTitle>➕ Adicionar Novo Prêmio</ModalTitle>

            <FormSection>
              <Label>Nome do Prêmio (identificador único):</Label>
              <Input
                type="text"
                placeholder="Ex: chaveiro, caneca, etc."
                value={newPrize.name}
                onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
              />
            </FormSection>

            <FormSection>
              <Label>Nome para Exibição:</Label>
              <Input
                type="text"
                placeholder="Ex: Chaveiro Personalizado, Caneca Térmica, etc."
                value={newPrize.displayName}
                onChange={(e) => setNewPrize({ ...newPrize, displayName: e.target.value })}
              />
            </FormSection>

            <FormSection>
              <Label>Quantidade:</Label>
              <Input
                type="number"
                min="0"
                placeholder="Quantidade disponível"
                value={newPrize.quantity}
                onChange={(e) => setNewPrize({ ...newPrize, quantity: e.target.value })}
              />
            </FormSection>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AddButton onClick={handleAddPrize} disabled={isUpdating || !newPrize.name || !newPrize.displayName}>
                {isUpdating ? <LoadingSpinner icon={faSpinner} /> : 'Adicionar Prêmio'}
              </AddButton>
              <SecondaryButton onClick={handleModalClose}>Cancelar</SecondaryButton>
            </div>
          </ModalContainer>
        </>
      )}
    </>
  );
};
