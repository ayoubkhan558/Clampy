import React from 'react';
import styles from './Modal.module.scss';

const AboutContent = () => (
  <div className={styles.content}>
    <h3>About the Developer</h3>
    <p>
      Clampy was designed and developed by <strong>Ayoub Khan</strong>, a passionate Full Stack Developer with a love for creating modern, responsive, and user-friendly web applications.
    </p>
    <p>
      This tool was built to simplify the process of generating fluid typography and spacing with CSS clamp(), helping developers save time and implement best practices for responsive design.
    </p>
    <p>
      Connect with Ayoub:
      <br />
      - <a href="https://mayoub.dev" target="_blank" rel="noopener noreferrer">Portfolio</a>
      <br />
      - <a href="https://github.com/ayoubkhan558" target="_blank" rel="noopener noreferrer">GitHub</a>
      <br />
      - <a href="https://linkedin.com/in/ayoubkhan558" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </p>
  </div>
);

export default AboutContent;
