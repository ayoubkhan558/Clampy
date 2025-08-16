import {
  HiDevicePhoneMobile,
  HiDeviceTablet,
  HiComputerDesktop,
  HiTrash
} from 'react-icons/hi2';
import styles from './BreakpointTable.module.scss';

/**
 * Get the appropriate icon based on device category
 */
const getDeviceIcon = (category) => {
  switch (category) {
    case 'mobile':
      return HiDevicePhoneMobile;
    case 'tablet':
      return HiDeviceTablet;
    case 'desktop':
      return HiComputerDesktop;
    default:
      return HiDevicePhoneMobile;
  }
};

/**
 * Breakpoint Table Component
 * Displays a table of breakpoints with device information and computed values
 */
const BreakpointTable = ({ breakpointTable, onDeleteBreakpoint }) => {
  if (!breakpointTable || breakpointTable.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No breakpoints available. Add some breakpoints to see the preview.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.breakpointTable}>
        <thead>
          <tr>
            <th>Device</th>
            <th>Screen Width</th>
            <th>Computed Value</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {breakpointTable.map((bp, index) => {
            const DeviceIcon = getDeviceIcon(bp.category);
            
            return (
              <tr key={bp.id || index} className={styles[`row${bp.status}`]}>
                <td className={styles.deviceCell}>
                  <div className={styles.deviceInfo}>
                    <DeviceIcon className={`${styles.deviceIcon} ${styles[`icon${bp.category}`]}`} />
                    <div>
                      <div className={styles.deviceName}>{bp.name}</div>
                      <div className={styles.deviceModel}>{bp.device}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.widthCell}>{bp.width}px</td>
                <td className={styles.valueCell}>
                  <span className={styles.computedValue}>
                    {bp.computedValue}{bp.unit}
                  </span>
                </td>
                <td className={styles.statusCell}>
                  <span className={`${styles.statusBadge} ${styles[`status${bp.status}`]}`}>
                    {bp.status === 'min' ? 'MIN' : bp.status === 'max' ? 'MAX' : 'FLUID'}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  {!bp.isDefault && (
                    <button
                      onClick={() => onDeleteBreakpoint(bp.id)}
                      className={styles.deleteButton}
                      title="Delete custom breakpoint"
                    >
                      <HiTrash className={styles.buttonIcon} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BreakpointTable;
