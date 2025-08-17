import { useState } from 'react';
import Modal from './Modal';
import AboutContent from './AboutContent';
import HowToUseContent from './HowToUseContent';
import styles from './Header.module.scss';

const Header = () => {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Logo/Brand */}
          <div className={styles.brand}>
            <h1 className={styles.logo}>Clampy</h1>
          </div>

          {/* Navigation (always visible, stacked on small screens) */}
          <nav className={styles.nav}>
            <div className={styles.navLinks}>
              <button onClick={() => openModal('about')} className={styles.navLink}>
                About
              </button>
              <button onClick={() => openModal('how-to-use')} className={styles.navLink}>
                How to Use
              </button>
              <a 
                href="https://github.com/ayoubkhan558/Clampy" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.navLink}
              >
                Source Code
              </a>
            </div>
          </nav>
        </div>
      </header>

      <Modal 
        isOpen={!!modalContent} 
        onClose={closeModal} 
        title={modalContent === 'about' ? 'About Clampy' : 'How to Use'}
      >
        {modalContent === 'about' && <AboutContent />}
        {modalContent === 'how-to-use' && <HowToUseContent />}
      </Modal>
    </>
  );
};

export default Header;
