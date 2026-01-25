import { useState } from 'react';
import { COLORS, RADIUS, SPACING, FONTS } from '../../theme/colors';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { TOPPINGS, CATEGORIES } from '../../data/menuItems';
import { formatCurrency } from '../../utils/calculations';
import { usePOS } from '../../hooks/usePOS';

// Inline Styles
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
    // Allow multiple toppings for drinks
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Toppings">
      <div style={styles.itemInfo}>
        <div style={styles.itemName}>{item.name}</div>
        <div style={styles.itemPrice}>{formatCurrency(item.price)}</div>
      </div>

      {availableToppings.length > 0 && (
        <>
          <h3 style={{ marginBottom: SPACING.md }}>Add Drink Toppings</h3>
          <div style={styles.toppingsGrid}>
            {availableToppings.map(topping => {
              const isSelected = selectedToppings.find(t => t.id === topping.id);
              return (
                <button
                  key={topping.id}
                  style={{
                    ...styles.toppingButton,
                    ...(isSelected ? styles.toppingButtonSelected : {}),
                  }}
                  onClick={() => toggleTopping(topping)}
                >
                  <div style={styles.toppingName}>
                    {isSelected && '✓ '}
                    {topping.name}
                  </div>
                  <div style={styles.toppingPrice}>
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

      <div style={styles.buttonGroup}>
        <Button variant="secondary" fullWidth onClick={handleSkipToppings}>
          Skip Toppings
        </Button>
        <Button variant="primary" fullWidth onClick={handleAddToOrder}>
          Add to Order
          {selectedToppings.length > 0 && ` (${selectedToppings.length})`}
        </Button>
      </div>
    </Modal>
  );
};

export default ToppingsModal;