import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from './convex/_generated/api';

// Creating the Prize context
const PrizeContext = createContext();

// Custom hook to access prize context
export const usePrize = () => useContext(PrizeContext);

export const PrizeProvider = ({ children }) => {
  const prizes = useQuery(api.prizes.getAllPrizes);
  const prizesForWheel = useQuery(api.prizes.getPrizesForWheel);
  const initializePrizes = useMutation(api.prizes.initializePrizes);
  const decreasePrizeQuantity = useMutation(api.prizes.decreasePrizeQuantity);
  const resetPrizes = useMutation(api.prizes.resetPrizes);
  const updateUserPrize = useMutation(api.users.updateUserPrize);

  // Initialize prizes when component mounts
  useEffect(() => {
    if (prizes && prizes.length === 0) {
      initializePrizes().catch(console.error);
    }
  }, [prizes, initializePrizes]);

  // Function to decrease the count of a prize after it's won
  const decreasePrizeCount = async (prizeName) => {
    try {
      await decreasePrizeQuantity({ prizeName });
    } catch (error) {
      console.error('Error decreasing prize count:', error);
    }
  };

  // Function to handle prize win
  const handlePrizeWin = async (userData, prizeName) => {
    try {
      // Update user's prize
      await updateUserPrize({
        userId: userData.userId,
        prizeName: prizeName,
      });
      
      // Decrease prize quantity
      await decreasePrizeCount(prizeName);
    } catch (error) {
      console.error('Error handling prize win:', error);
    }
  };

  // Function to reset to default prizes
  const resetPrizesToDefault = async () => {
    try {
      await resetPrizes();
    } catch (error) {
      console.error('Error resetting prizes:', error);
    }
  };

  // Convert prizes to the format expected by the wheel component
  const getFormattedPrizes = () => {
    if (!prizes) return [];
    
    return prizes.map(prize => ({
      [prize.name]: prize.quantity
    })).reduce((acc, curr) => ({...acc, ...curr}), {});
  };

  return (
    <PrizeContext.Provider value={{ 
      prizes: getFormattedPrizes(),
      prizesForWheel,
      decreasePrizeCount,
      handlePrizeWin,
      resetPrizesToDefault,
      isLoading: prizes === undefined
    }}>
      {children}
    </PrizeContext.Provider>
  );
};
