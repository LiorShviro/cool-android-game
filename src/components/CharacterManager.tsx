import React from 'react';
import { useCharacterManager } from '../hooks/useCharacterManager';

export const CharacterManager: React.FC = () => {
  useCharacterManager();
  return null;
};
