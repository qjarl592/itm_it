import React, { useState } from 'react';
import AssetAddForm from './Asset_add_form';

const Modalbutton = ({contract, accounts}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMintDone, setIsMintDone] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setIsMintDone(false)
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsMintDone(false);
  };

  const mintComplete = () => {
    setIsMintDone(true);
  }

  return (
      <div>
        <button onClick={openModal}>add asset</button>
        <AssetAddForm contract={contract} accounts={accounts} 
        isOpen={isModalOpen} isMintDone = {isMintDone} 
        close={closeModal} mintCheck = {mintComplete}/>
      </div>
  );
}

export default Modalbutton;