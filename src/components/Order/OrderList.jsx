import { COLORS, SPACING, FONTS } from '../../theme/colors';
import OrderItem from './OrderItem';
import { usePOS } from '../../hooks/usePOS';

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
      <>
        <style>{`
          /* Tablet: 768px - 1024px */
          @media (max-width: 1024px) and (min-width: 768px) {
            .order-list {
              margin-bottom: 14px !important;
              min-height: 180px !important;
            }
            .order-list-empty {
              padding: 24px 16px !important;
              font-size: 13px !important;
            }
          }

          /* Mobile: 480px - 768px */
          @media (max-width: 768px) {
            .order-list {
              margin-bottom: 12px !important;
              min-height: 160px !important;
            }
            .order-list-empty {
              padding: 20px 16px !important;
              font-size: 13px !important;
            }
          }

          /* Small Mobile: < 480px */
          @media (max-width: 480px) {
            .order-list {
              margin-bottom: 10px !important;
              min-height: 140px !important;
            }
            .order-list-empty {
              padding: 18px 12px !important;
              font-size: 12px !important;
            }
          }
        `}</style>

        <div style={styles.orderList} className="order-list">
          <p style={styles.emptyOrder} className="order-list-empty">No items added yet</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        /* Hide scrollbar */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #5568d3;
        }

        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .order-list {
            margin-bottom: 14px !important;
            min-height: 180px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .order-list {
            margin-bottom: 12px !important;
            min-height: 160px !important;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .order-list {
            margin-bottom: 10px !important;
            min-height: 140px !important;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>

      <div style={styles.orderList} className="order-list scrollbar-thin">
        {currentOrder.map(item => (
          <OrderItem key={item.orderId} item={item} />
        ))}
      </div>
    </>
  );
};

export default OrderList;