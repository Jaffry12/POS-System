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
      <div
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
        <div style={styles.name}>{item.name}</div>
        <div style={styles.price}>{priceDisplay}</div>
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