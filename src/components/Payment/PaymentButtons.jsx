import { COLORS, SPACING } from '../../theme/colors';
import Button from '../Common/Button';
import { usePOS } from '../../hooks/usePOS';

// Inline Styles
const styles = {
  orderActions: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: SPACING.sm,
  },
};

const PaymentButtons = () => {
  const { currentOrder, clearOrder, setShowPaymentModal } = usePOS();
  const hasItems = currentOrder.length > 0;

  return (
    <div style={styles.orderActions}>
      <Button 
        variant="secondary" 
        fullWidth 
        onClick={clearOrder}
        disabled={!hasItems}
      >
        Clear Order
      </Button>
      
      <Button 
        variant="success" 
        fullWidth 
        onClick={() => setShowPaymentModal(true)}
        disabled={!hasItems}
        style={{ fontSize: '18px' }}
      >
        💷 Cash Payment
      </Button>
      
      <Button 
        variant="primary" 
        fullWidth 
        onClick={() => {
          if (hasItems) {
            alert('Card payment feature - integrate with payment terminal');
          }
        }}
        disabled={!hasItems}
        style={{ fontSize: '18px' }}
      >
        💳 Card Payment
      </Button>
    </div>
  );
};

export default PaymentButtons;