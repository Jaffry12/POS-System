import { COLORS, RADIUS, SPACING, SHADOWS } from '../../theme/colors';

// Inline Styles
const styles = {
  overlay: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  modalContent: {
    background: COLORS.white,
    padding: SPACING.xl,
    borderRadius: RADIUS.large,
    minWidth: '400px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: SHADOWS.large,
    animation: 'slideIn 0.3s ease',
  },
  header: {
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottom: `2px solid ${COLORS.gray200}`,
  },
  title: {
    margin: 0,
    color: COLORS.textPrimary,
    fontSize: '24px',
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: COLORS.textSecondary,
    padding: SPACING.sm,
    borderRadius: RADIUS.small,
    transition: 'all 0.2s ease',
  },
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={{ ...styles.modalContent, position: 'relative' }}>
        <button
          style={styles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.target.style.background = COLORS.gray200;
            e.target.style.color = COLORS.textPrimary;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = COLORS.textSecondary;
          }}
        >
          ✕
        </button>
        {title && (
          <div style={styles.header}>
            <h2 style={styles.title}>{title}</h2>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

