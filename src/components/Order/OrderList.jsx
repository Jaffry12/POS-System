import { COLORS, SPACING, FONTS } from '../../theme/colors';
import OrderItem from './OrderItem';
import { usePOS } from '../../hooks/usePOS';

// Inline Styles
const styles = {
  orderList: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: SPACING.lg,
    minHeight: '200px',
  },
  emptyOrder: {
    textAlign: 'center',
    color: COLORS.textLight,
    padding: `${SPACING.xxl} ${SPACING.lg}`,
    fontStyle: 'italic',
    fontSize: FONTS.medium,
  },
};

const OrderList = () => {
  const { currentOrder } = usePOS();

  if (currentOrder.length === 0) {
    return (
      <div style={styles.orderList}>
        <p style={styles.emptyOrder}>No items added yet</p>
      </div>
    );
  }

  return (
    <div style={styles.orderList} className="scrollbar-thin">
      {currentOrder.map(item => (
        <OrderItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default OrderList;