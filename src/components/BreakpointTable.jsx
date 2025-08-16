import { useState } from 'react';
import {
  HiDevicePhoneMobile,
  HiDeviceTablet,
  HiComputerDesktop,
  HiTrash,
  HiPencil,
  HiCheck,
  HiXMark
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
const BreakpointTable = ({ breakpointTable, onDeleteBreakpoint, onUpdateBreakpoint }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  if (!breakpointTable || breakpointTable.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No breakpoints available. Add some breakpoints to see the preview.</p>
      </div>
    );
  }

  const handleEdit = (breakpoint) => {
    setEditingId(breakpoint.id);
    setEditForm({
      name: breakpoint.name,
      width: breakpoint.width,
      device: breakpoint.device
    });
  };

  const handleSave = () => {
    if (editForm.name && editForm.width && editForm.device) {
      onUpdateBreakpoint(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isEditing = (id) => editingId === id;

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
            const isEditMode = isEditing(bp.id);
            
            return (
              <tr key={bp.id || index} className={styles[`row${bp.status}`]}>
                <td className={styles.deviceCell}>
                  {isEditMode ? (
                    <div className={styles.editFields}>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={styles.editInput}
                        placeholder="Breakpoint name"
                      />
                      <input
                        type="text"
                        value={editForm.device || ''}
                        onChange={(e) => handleInputChange('device', e.target.value)}
                        className={styles.editInput}
                        placeholder="Device name"
                      />
                    </div>
                  ) : (
                    <div className={styles.deviceInfo}>
                      <DeviceIcon className={`${styles.deviceIcon} ${styles[`icon${bp.category}`]}`} />
                      <div>
                        <div className={styles.deviceName}>{bp.name}</div>
                        <div className={styles.deviceModel}>{bp.device}</div>
                      </div>
                    </div>
                  )}
                </td>
                <td className={styles.widthCell}>
                  {isEditMode ? (
                    <input
                      type="number"
                      value={editForm.width || ''}
                      onChange={(e) => handleInputChange('width', parseInt(e.target.value))}
                      className={styles.editInput}
                      placeholder="Width"
                      min="200"
                      max="4000"
                    />
                  ) : (
                    `${bp.width}px`
                  )}
                </td>
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
                  <div className={styles.actionButtons}>
                    {isEditMode ? (
                      <>
                        <button
                          onClick={handleSave}
                          className={`${styles.actionButton} ${styles.saveButton}`}
                          title="Save changes"
                          disabled={!editForm.name || !editForm.width || !editForm.device}
                        >
                          <HiCheck className={styles.buttonIcon} />
                        </button>
                        <button
                          onClick={handleCancel}
                          className={`${styles.actionButton} ${styles.cancelButton}`}
                          title="Cancel editing"
                        >
                          <HiXMark className={styles.buttonIcon} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(bp)}
                          className={`${styles.actionButton} ${styles.editButton}`}
                          title="Edit breakpoint"
                        >
                          <HiPencil className={styles.buttonIcon} />
                        </button>
                        {!bp.isDefault && (
                          <button
                            onClick={() => onDeleteBreakpoint(bp.id)}
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            title="Delete breakpoint"
                          >
                            <HiTrash className={styles.buttonIcon} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
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
