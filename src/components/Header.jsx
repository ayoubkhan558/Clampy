import { useState } from 'react';
import { HiMenu, HiX, HiGlobeAlt } from 'react-icons/hi';
import Modal from './Modal';
import AboutContent from './AboutContent';
import HowToUseContent from './HowToUseContent';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import styles from './Header.module.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsMenuOpen(false);
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

        {/* Desktop Navigation */}
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

        {/* Mobile Menu Button */}
        <button 
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileNavLinks}>
              <button onClick={() => openModal('about')} className={styles.mobileNavLink}>
                About
              </button>
              <button onClick={() => openModal('how-to-use')} className={styles.mobileNavLink}>
                How to Use
              </button>
              <a 
                href="https://github.com/ayoubkhan558/Clampy" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Source Code
              </a>
            </div> 
          </div>
        )}
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
