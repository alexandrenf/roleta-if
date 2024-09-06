import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { usePrize } from './PrizeContext';

// Styled components
const GearIconContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 30px;
  color: #f44336;
  &:hover {
    color: #e53935;
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
  width: 400px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #45a049;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  box-sizing: border-box;
`;

export const HeatButton = ({ disabled }) => {
  const { prizes, updatePrizes, resetPrizesToDefault } = usePrize(); // Access the reset function from context
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrize, setNewPrize] = useState({ name: '', quantity: 1 });
  const [editPrize, setEditPrize] = useState({ name: '', quantity: 1 });

  const handleAddPrize = () => {
    if (newPrize.name && newPrize.quantity) {
      const updatedPrizes = { ...prizes, [newPrize.name.toLowerCase()]: parseInt(newPrize.quantity, 10) };
      updatePrizes(updatedPrizes);
      setNewPrize({ name: '', quantity: 1 });
      setShowAddModal(false);
    }
  };

  const handleRemovePrize = (prize) => {
    const updatedPrizes = { ...prizes };
    delete updatedPrizes[prize];
    updatePrizes(updatedPrizes);
    setShowEditModal(false);
  };

  const handleSaveEditPrize = () => {
    const updatedPrizes = { ...prizes };
    updatedPrizes[editPrize.name] = parseInt(editPrize.quantity, 10);
    updatePrizes(updatedPrizes);
    setShowEditModal(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  return (
    <>
      <GearIconContainer onClick={() => !disabled && setShowModal(true)} disabled={disabled}>
        <FontAwesomeIcon icon={faCog} />
      </GearIconContainer>

      {showModal && (
        <>
          <Overlay onClick={handleModalClose} />
          <ModalContainer>
            <h3>Edit Prizes</h3>

            {Object.keys(prizes).map((prize) => (
              <div key={prize}>
                <span>{prize}: {prizes[prize]}</span>
                <Button onClick={() => {
                  setEditPrize({ name: prize, quantity: prizes[prize] });
                  setShowEditModal(true);
                }}>
                  Edit
                </Button>
              </div>
            ))}

            <Button onClick={() => setShowAddModal(true)}>Add New Prize</Button>
            <Button onClick={() => resetPrizesToDefault()}>Reset to Default</Button> {/* Reset button */}
            <Button onClick={handleModalClose}>Close</Button>
          </ModalContainer>
        </>
      )}

      {showEditModal && (
        <>
          <Overlay onClick={handleModalClose} />
          <ModalContainer>
            <h3>Edit {editPrize.name}</h3>

            <Input
              type="text"
              placeholder="Prize Name"
              value={editPrize.name}
              onChange={(e) => setEditPrize({ ...editPrize, name: e.target.value })}
            />

            {editPrize.name !== 'tryagain' && (
              <Input
                type="number"
                min="1"
                placeholder="Quantity"
                value={editPrize.quantity}
                onChange={(e) => setEditPrize({ ...editPrize, quantity: e.target.value })}
              />
            )}

            <Button onClick={handleSaveEditPrize}>Save</Button>
            {editPrize.name !== 'tryagain' && (
              <Button onClick={() => handleRemovePrize(editPrize.name)}>Remove Prize</Button>
            )}
            <Button onClick={handleModalClose}>Close</Button>
          </ModalContainer>
        </>
      )}

      {showAddModal && (
        <>
          <Overlay onClick={handleModalClose} />
          <ModalContainer>
            <h3>Add New Prize</h3>
            <Input
              type="text"
              placeholder="Prize Name"
              value={newPrize.name}
              onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
            />
            <Input
              type="number"
              min="1"
              placeholder="Quantity"
              value={newPrize.quantity}
              onChange={(e) => setNewPrize({ ...newPrize, quantity: e.target.value })}
            />
            <Button onClick={handleAddPrize}>Add Prize</Button>
            <Button onClick={handleModalClose}>Close</Button>
          </ModalContainer>
        </>
      )}
    </>
  );
};
