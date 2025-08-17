import React from 'react';
import styles from './Modal.module.scss';

const HowToUseContent = () => (
  <div className={styles.content}>
    <h3>How to Use Clampy</h3>
    <p>
      <strong>1. Set Your Viewport Range:</strong>
      <br />
      Enter the minimum and maximum screen widths where you want the fluid scaling to apply. For example, 320px for mobile and 1200px for desktop.
    </p>
    <p>
      <strong>2. Define Your Size Range:</strong>
      <br />
      Set the minimum and maximum font size (or any other property value) that corresponds to your viewport range.
    </p>
    <p>
      <strong>3. Customize Breakpoints (Optional):</strong>
      <br />
      Add, edit, or remove breakpoints in the table to see how your values behave at specific screen sizes. The chart will update in real-time.
    </p>
    <p>
      <strong>4. Grab the Code:</strong>
      <br />
      The generated CSS clamp() function is available in the "Code" tab. You can also find options for CSS Custom Properties, SCSS mixins, and fallbacks for older browsers.
    </p>
  </div>
);

export default HowToUseContent;
