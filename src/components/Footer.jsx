import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa6';
import { HiGlobeAlt } from 'react-icons/hi';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brand}>
            <h3 className={styles.brandName}>Clampy</h3>
            <p className={styles.brandDescription}>
              A modern CSS clamp() generator for fluid responsive design. 
              Create beautiful, scalable typography and spacing with ease.
            </p>
            <div className={styles.socialLinks}>
              <a 
                href="https://mayoub.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="Visit mayoub.dev"
              >
                <HiGlobeAlt />
              </a>
              <a 
                href="https://github.com/ayoubkhan558/Clampy" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="View on GitHub"
              >
                <FaGithub />
              </a>
              <a 
                href="https://linkedin.com/in/ayoubkhan558" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="Connect on LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div> 
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>© {currentYear} Clampy. Built with <FaHeart className={styles.heart} /> by Ayoub Khan</p>
          </div>
          <div className={styles.tech}>
            <span>Built with React • Vite • SCSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
