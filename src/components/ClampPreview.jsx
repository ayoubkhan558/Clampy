import { useState, useEffect } from 'react';
import styles from './ClampPreview.module.scss';
import { HiDeviceMobile, HiDeviceTablet, HiDesktopComputer } from 'react-icons/hi';

const ClampPreview = ({ formData, clampValue, outputs }) => {
  const [viewportWidth, setViewportWidth] = useState(375);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(0);

  // Calculate the current font size based on viewport width
  useEffect(() => {
    if (!formData || !outputs) return;
    
    const minScreen = parseFloat(formData.minScreenWidth);
    const maxScreen = parseFloat(formData.maxScreenWidth);
    const minSize = parseFloat(formData.minSize);
    const maxSize = parseFloat(formData.maxSize);
    
    // Calculate the slope and intercept for the linear equation
    const slope = (maxSize - minSize) / (maxScreen - minScreen);
    const intercept = minSize - (slope * minScreen);
    
    // Calculate font size based on current viewport width
    let fontSize;
    if (viewportWidth <= minScreen) {
      fontSize = minSize;
    } else if (viewportWidth >= maxScreen) {
      fontSize = maxSize;
    } else {
      fontSize = (slope * viewportWidth) + intercept;
    }
    
    setCurrentFontSize(fontSize);
  }, [viewportWidth, formData, outputs]);

  // Handle slider change
  const handleSliderChange = (e) => {
    setViewportWidth(parseInt(e.target.value, 10));
  };

  // Handle mouse down on the slider thumb
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // Handle mouse up on the slider thumb
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse move for drag
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const slider = document.querySelector(`.${styles.sliderContainer} input`);
        const rect = slider.getBoundingClientRect();
        const min = parseInt(slider.min, 10);
        const max = parseInt(slider.max, 10);
        
        // Calculate the new value based on mouse position
        let newValue = ((e.clientX - rect.left) / rect.width) * (max - min) + min;
        newValue = Math.max(min, Math.min(max, newValue));
        
        setViewportWidth(Math.round(newValue));
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp, { once: true });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewContent}>
        
        <div className={styles.sliderContainer}>
          <div className={styles.sliderLabels}>
            <span>{formData.minScreenWidth}px</span>
            <span>{viewportWidth}px</span>
            <span>{formData.maxScreenWidth}px</span>
          </div>
          <input
            type="range"
            min={formData.minScreenWidth}
            max={formData.maxScreenWidth}
            value={viewportWidth}
            onChange={handleSliderChange}
            onMouseDown={handleMouseDown}
            className={styles.slider}
          />
          <div className={styles.deviceIcons}>
            <HiDeviceMobile className={styles.deviceIcon} />
            <HiDeviceTablet className={styles.deviceIcon} />
            <HiDesktopComputer className={styles.deviceIcon} />
          </div>
        </div>
        
        <div className={styles.fontSizeDisplay}>
          <span>Font Size: {currentFontSize.toFixed(1)}px</span>
          <span>Viewport: {viewportWidth}px</span>
        </div>
        
        <div 
          className={styles.previewText}
          style={{ fontSize: `${currentFontSize}px` }}
        >
          The quick brown fox jumps over the lazy dog
        </div>
      </div>
    </div>
  );
};

export default ClampPreview;
