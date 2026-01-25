import { useState } from 'react';
import { COLORS, RADIUS, SPACING, FONTS } from '../../theme/colors';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { TOPPINGS, CATEGORIES } from '../../data/menuItems';
import { formatCurrency } from '../../utils/calculations';
import { usePOS } from '../../hooks/usePOS';

const styles = {
  itemInfo: {
    background: COLORS.gray100,
    padding: SPACING.lg,
    borderRadius: RADIUS.medium,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  itemName: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  itemPrice: {
    fontSize: FONTS.large,
    color: COLORS.primary,
  },
  toppingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  toppingButton: {
    padding: SPACING.md,
    border: `2px solid ${COLORS.gray300}`,
    borderRadius: RADIUS.small,
    background: COLORS.white,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  toppingButtonSelected: {
    borderColor: COLORS.primary,
    background: COLORS.gray100,
  },
  toppingName: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  toppingPrice: {
    fontSize: FONTS.small,
    color: COLORS.success,
  },
  buttonGroup: {
    display: 'flex',
    gap: SPACING.sm,
  },
};

const ToppingsModal = ({ isOpen, onClose, item }) => {
  const { addToOrder } = usePOS();
  const [selectedToppings, setSelectedToppings] = useState([]);

  if (!item) return null;

  const category = CATEGORIES[item.category];
  const toppingType = category?.toppingType || 'drink';
  const availableToppings = TOPPINGS[toppingType] || [];

  const toggleTopping = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.id === topping.id);
      if (exists) {
        return prev.filter(t => t.id !== topping.id);
      }
      return [...prev, topping];
    });
  };

  const handleAddToOrder = () => {
    const totalToppingPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    const itemWithToppings = {
      ...item,
      toppings: selectedToppings,
      originalPrice: item.price,
      price: item.price + totalToppingPrice,
    };
    
    addToOrder(itemWithToppings);
    setSelectedToppings([]);
    onClose();
  };

  const handleSkipToppings = () => {
    addToOrder(item);
    setSelectedToppings([]);
    onClose();
  };

  return (
    <>
      <style>{`
        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .toppings-item-info {
            padding: 16px !important;
            margin-bottom: 20px !important;
          }
          .toppings-item-name {
            font-size: 17px !important;
          }
          .toppings-item-price {
            font-size: 15px !important;
          }
          .toppings-grid {
            gap: 10px !important;
            margin-bottom: 20px !important;
          }
          .toppings-button {
            padding: 10px !important;
          }
          .toppings-name {
            font-size: 13px !important;
          }
          .toppings-price {
            font-size: 12px !important;
          }
          .toppings-button-group {
            gap: 10px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .toppings-item-info {
            padding: 16px !important;
            margin-bottom: 18px !important;
          }
          .toppings-item-name {
            font-size: 18px !important;
          }
          .toppings-item-price {
            font-size: 16px !important;
          }
          .toppings-heading {
            font-size: 16px !important;
            margin-bottom: 12px !important;
          }
          .toppings-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            margin-bottom: 18px !important;
          }
          .toppings-button {
            padding: 12px !important;
          }
          .toppings-name {
            font-size: 14px !important;
          }
          .toppings-price {
            font-size: 13px !important;
          }
          .toppings-button-group {
            flex-direction: column !important;
            gap: 10px !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .toppings-item-info {
            padding: 14px !important;
            margin-bottom: 16px !important;
          }
          .toppings-item-name {
            font-size: 17px !important;
            margin-bottom: 6px !important;
          }
          .toppings-item-price {
            font-size: 15px !important;
          }
          .toppings-heading {
            font-size: 15px !important;
            margin-bottom: 10px !important;
          }
          .toppings-grid {
            gap: 8px !important;
            margin-bottom: 16px !important;
          }
          .toppings-button {
            padding: 10px !important;
          }
          .toppings-name {
            font-size: 13px !important;
            margin-bottom: 4px !important;
          }
          .toppings-price {
            font-size: 12px !important;
          }
          .toppings-button-group {
            gap: 8px !important;
          }
        }
      `}</style>

      <Modal isOpen={isOpen} onClose={onClose} title="Add Toppings">
        <div style={styles.itemInfo} className="toppings-item-info">
          <div style={styles.itemName} className="toppings-item-name">{item.name}</div>
          <div style={styles.itemPrice} className="toppings-item-price">{formatCurrency(item.price)}</div>
        </div>

        {availableToppings.length > 0 && (
          <>
            <h3 style={{ marginBottom: SPACING.md }} className="toppings-heading">
              Add Drink Toppings
            </h3>
            <div style={styles.toppingsGrid} className="toppings-grid">
              {availableToppings.map(topping => {
                const isSelected = selectedToppings.find(t => t.id === topping.id);
                return (
                  <button
                    key={topping.id}
                    style={{
                      ...styles.toppingButton,
                      ...(isSelected ? styles.toppingButtonSelected : {}),
                    }}
                    className="toppings-button"
                    onClick={() => toggleTopping(topping)}
                  >
                    <div style={styles.toppingName} className="toppings-name">
                      {isSelected && '✓ '}
                      {topping.name}
                    </div>
                    <div style={styles.toppingPrice} className="toppings-price">
                      {topping.free || topping.price === 0 
                        ? 'FREE' 
                        : `+${formatCurrency(topping.price)}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div style={styles.buttonGroup} className="toppings-button-group">
          <Button variant="secondary" fullWidth onClick={handleSkipToppings}>
            Skip Toppings
          </Button>
          <Button variant="primary" fullWidth onClick={handleAddToOrder}>
            Add to Order
            {selectedToppings.length > 0 && ` (${selectedToppings.length})`}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ToppingsModal;