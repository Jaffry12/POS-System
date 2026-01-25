import { COLORS, RADIUS, SPACING, SHADOWS } from '../../theme/colors';

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
    <>
      <style>{`
        /* Hide scrollbar for modal content */
        .common-modal-content {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .common-modal-content::-webkit-scrollbar {
          display: none;
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .common-modal-content {
            padding: 24px !important;
            min-width: 350px !important;
            max-width: 85vw !important;
          }
          .common-modal-title {
            font-size: 22px !important;
          }
          .common-modal-header {
            margin-bottom: 20px !important;
            padding-bottom: 12px !important;
          }
          .common-modal-close {
            top: 20px !important;
            right: 20px !important;
            font-size: 22px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .common-modal-content {
            padding: 20px !important;
            min-width: 0 !important;
            max-width: 95vw !important;
            max-height: 85vh !important;
            border-radius: 12px !important;
          }
          .common-modal-title {
            font-size: 20px !important;
            padding-right: 40px !important;
          }
          .common-modal-header {
            margin-bottom: 18px !important;
            padding-bottom: 12px !important;
          }
          .common-modal-close {
            top: 18px !important;
            right: 18px !important;
            font-size: 20px !important;
            padding: 6px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .common-modal-overlay {
            padding: 10px !important;
          }
          .common-modal-content {
            padding: 16px !important;
            max-width: 100vw !important;
            max-height: 90vh !important;
            border-radius: 10px !important;
          }
          .common-modal-title {
            font-size: 18px !important;
            padding-right: 35px !important;
            line-height: 1.3 !important;
          }
          .common-modal-header {
            margin-bottom: 16px !important;
            padding-bottom: 10px !important;
          }
          .common-modal-close {
            top: 14px !important;
            right: 14px !important;
            font-size: 18px !important;
            padding: 4px !important;
          }
        }
      `}</style>

      <div 
        style={styles.overlay} 
        className="common-modal-overlay"
        onClick={handleOverlayClick}
      >
        <div 
          style={{ ...styles.modalContent, position: 'relative' }}
          className="common-modal-content"
        >
          <button
            style={styles.closeButton}
            className="common-modal-close"
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
            <div style={styles.header} className="common-modal-header">
              <h2 style={styles.title} className="common-modal-title">{title}</h2>
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;