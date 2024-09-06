import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';

// Creating the Prize context
const PrizeContext = createContext();

// Custom hook to access prize context
export const usePrize = () => useContext(PrizeContext);

// Function to load prize data from cookies or set default values
const defaultPrizes = {
  bag: 10,
  copo: 5,
  caneta: 15,
  caderno: 7,
  kit:3,
  tentenovamente: 1, // Always available
};

const loadPrizesFromCookies = () => {
  const cookiePrizes = Cookies.get('prizes');
  return cookiePrizes ? JSON.parse(cookiePrizes) : defaultPrizes;
};

// Function to save prize data to cookies
const savePrizesToCookies = (prizes) => {
  Cookies.set('prizes', JSON.stringify(prizes), { expires: 7 });
};

export const PrizeProvider = ({ children }) => {
  const [prizes, setPrizes] = useState(loadPrizesFromCookies());

  const updatePrizes = (newPrizes) => {
    setPrizes(newPrizes);
    savePrizesToCookies(newPrizes);
  };

  // Function to decrease the count of a prize after it's won
  const decreasePrizeCount = (prize) => {
    setPrizes((prev) => {
      const updatedPrizes = {
        ...prev,
        [prize]: prev[prize] > 0 ? prev[prize] - 1 : prev[prize], // Decrease prize count if greater than 0
      };
      savePrizesToCookies(updatedPrizes); // Save updated prize count to cookies
      return updatedPrizes;
    });
  };

  // Function to reset to default prizes
  const resetPrizesToDefault = () => {
    setPrizes(defaultPrizes);
    savePrizesToCookies(defaultPrizes);
  };

  return (
    <PrizeContext.Provider value={{ prizes, updatePrizes, decreasePrizeCount, resetPrizesToDefault }}>
      {children}
    </PrizeContext.Provider>
  );
};
