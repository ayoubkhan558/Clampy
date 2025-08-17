import { useState, useEffect } from 'react';
import styles from './ClampPreview.module.scss';
import { HiDeviceMobile, HiDeviceTablet, HiDesktopComputer } from 'react-icons/hi';

const ClampPreview = ({ formData, clampValue, outputs }) => {
  const [viewportWidth, setViewportWidth] = useState(375);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(0);
  const [customText, setCustomText] = useState('The quick brown fox jumps over the lazy dog');

  // Calculate current font size based on viewport width
  useEffect(() => {
    if (!formData || !outputs.cssClamp) return;
    
    const { minSize, maxSize, minScreenWidth, maxScreenWidth, outputUnit, rootFontSize } = formData;
    const minScreen = parseFloat(minScreenWidth);
    const maxScreen = parseFloat(maxScreenWidth);
    const minSizeNum = parseFloat(minSize);
    const maxSizeNum = parseFloat(maxSize);
    const rootSizeNum = parseFloat(rootFontSize) || 16;
    
    // Calculate linear interpolation
    const slope = (maxSizeNum - minSizeNum) / (maxScreen - minScreen);
    const intercept = minSizeNum - (slope * minScreen);
    
    // Calculate font size based on current viewport width (in the selected output unit)
    let fontSize;
    if (viewportWidth <= minScreen) {
      fontSize = minSizeNum;
    } else if (viewportWidth >= maxScreen) {
      fontSize = maxSizeNum;
    } else {
      fontSize = (slope * viewportWidth) + intercept;
    }
    
    // Keep in selected unit; do not convert to px
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
          <span>Font Size: {currentFontSize.toFixed(2)}{formData?.outputUnit || 'px'}</span>
          <span>Viewport: {viewportWidth}px</span>
        </div>
        
        <div className={styles.textInputContainer}>
          <label className={styles.textInputLabel}>Preview Text:</label>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className={styles.textInput}
            placeholder="Enter custom text to preview..."
          />
        </div>
        
        <div 
          className={styles.previewText}
          style={{ fontSize: `${currentFontSize}${formData?.outputUnit || 'px'}` }}
        >
          {customText}
        </div>
      </div>
    </div>
  );
};

export default ClampPreview;
