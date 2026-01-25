import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ModifierModal from './ModifierModal';
import { SETTINGS } from '../../data/menuData';

const MenuItem = ({ item }) => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  // Determine if item has sizes or fixed price
  const hasSizes = item.prices && typeof item.prices === 'object';
  
  // Display price - show lowest price if has sizes
  const priceDisplay = hasSizes 
    ? `${SETTINGS.currency}${(Object.values(item.prices)[0] / 100).toFixed(2)}` 
    : `${SETTINGS.currency}${(item.price / 100).toFixed(2)}`;

  const styles = {
    card: {
      background: theme.cardBg,
      borderRadius: '12px',
      padding: '16px',
      boxShadow: theme.shadow,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: `2px solid ${theme.border}`,
      minHeight: '80px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
    },
    name: {
      fontSize: '15px',
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: '8px',
      lineHeight: '1.3',
    },
    price: {
      fontSize: '18px',
      fontWeight: '700',
      color: theme.primary,
    },
  };

  return (
    <>
      <style>{`
        /* Desktop (default - unchanged) */
        .menu-item-card {
          padding: 16px;
          min-height: 80px;
        }

        .menu-item-name {
          font-size: 15px;
          margin-bottom: 8px;
        }

        .menu-item-price {
          font-size: 18px;
        }

        /* Tablet: Slightly smaller */
        @media (max-width: 1024px) {
          .menu-item-card {
            padding: 14px !important;
            min-height: 75px !important;
          }

          .menu-item-name {
            font-size: 14px !important;
          }

          .menu-item-price {
            font-size: 17px !important;
          }
        }

        /* Mobile: Compact card */
        @media (max-width: 768px) {
          .menu-item-card {
            padding: 12px !important;
            min-height: 70px !important;
            border-radius: 10px !important;
          }

          .menu-item-name {
            font-size: 13px !important;
            margin-bottom: 6px !important;
            line-height: 1.2 !important;
          }

          .menu-item-price {
            font-size: 16px !important;
          }
        }

        /* Small Mobile: Very compact */
        @media (max-width: 480px) {
          .menu-item-card {
            padding: 10px !important;
            min-height: 65px !important;
          }

          .menu-item-name {
            font-size: 12px !important;
          }

          .menu-item-price {
            font-size: 15px !important;
          }
        }
      `}</style>

      <div
        className="menu-item-card"
        style={styles.card}
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = theme.shadowMedium;
          e.currentTarget.style.borderColor = theme.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = theme.shadow;
          e.currentTarget.style.borderColor = theme.border;
        }}
      >
        <div className="menu-item-name" style={styles.name}>{item.name}</div>
        <div className="menu-item-price" style={styles.price}>{priceDisplay}</div>
      </div>

      {showModal && (
        <ModifierModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MenuItem;