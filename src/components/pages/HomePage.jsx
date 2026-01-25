import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingCart, X } from 'lucide-react';
import CategoryPills from '../../components/Menu/CategoryPills';
import MenuGrid from '../../components/Menu/MenuGrid';
import OrderPanel from '../../components/Order/OrderPanel';
import { usePOS } from '../../hooks/usePOS';

const HomePage = () => {
  const { theme } = useTheme();
  const { currentOrder } = usePOS();
  const [showMobileCart, setShowMobileCart] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      background: theme.bgPrimary,
      overflow: 'hidden',
      position: 'relative',
    },
    leftSection: {
      flex: 1,
      marginRight: '400px',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflow: 'hidden',
    },
    menuArea: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingBottom: '40px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
    
    // Mobile floating cart button
    mobileCartButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: theme.success,
      color: '#FFFFFF',
      border: 'none',
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      zIndex: 50,
      transition: 'all 0.3s ease',
    },
    cartBadge: {
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      background: theme.danger,
      color: '#FFFFFF',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '700',
      border: '2px solid white',
    },
    
    // Mobile overlay
    mobileOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 90,
      opacity: showMobileCart ? 1 : 0,
      pointerEvents: showMobileCart ? 'auto' : 'none',
      transition: 'opacity 0.3s ease',
    },
  };

  const totalItems = currentOrder.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <style>
        {`
          /* Hide scrollbar */
          .menu-scrollable::-webkit-scrollbar {
            display: none;
          }

          /* Desktop (unchanged) */
          .home-left-section {
            margin-right: 400px;
          }

          .home-order-panel {
            display: flex;
          }

          .mobile-cart-btn {
            display: none;
          }

          /* Tablet: Reduce order panel width */
          @media (max-width: 1280px) {
            .home-left-section {
              margin-right: 350px !important;
            }
            
            .home-order-panel {
              width: 350px !important;
            }
          }

          /* Tablet/Mobile: Hide order panel, show floating button */
          @media (max-width: 1024px) {
            .home-left-section {
              margin-right: 0 !important;
            }
            
            .home-order-panel {
              display: none !important;
            }
            
            .mobile-cart-btn {
              display: flex !important;
            }
            
            /* Mobile cart drawer */
            .mobile-order-panel {
              position: fixed !important;
              bottom: 0;
              left: 0;
              right: 0;
              width: 100% !important;
              height: 70vh !important;
              max-height: 600px;
              border-radius: 20px 20px 0 0 !important;
              transform: translateY(${showMobileCart ? '0' : '100%'});
              transition: transform 0.3s ease;
              z-index: 100;
              box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.25);
            }
          }

          /* Mobile: Adjust menu padding */
          @media (max-width: 768px) {
            .menu-scrollable {
              padding-bottom: 100px !important;
            }
            
            .mobile-cart-btn {
              bottom: 16px !important;
              right: 16px !important;
              width: 56px !important;
              height: 56px !important;
            }
            
            .mobile-order-panel {
              max-height: 75vh !important;
            }
          }

          /* Small Mobile: Even more compact */
          @media (max-width: 480px) {
            .mobile-cart-btn {
              width: 52px !important;
              height: 52px !important;
            }
            
            .mobile-order-panel {
              max-height: 80vh !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Left Section: Categories + Menu */}
        <div className="home-left-section" style={styles.leftSection}>
          <CategoryPills />
          <div style={styles.menuArea} className="menu-scrollable">
            <MenuGrid />
          </div>
        </div>

        {/* Desktop Order Panel (always visible on desktop) */}
        <div className="home-order-panel">
          <OrderPanel />
        </div>

        {/* Mobile Cart Button */}
        <button
          className="mobile-cart-btn"
          style={styles.mobileCartButton}
          onClick={() => setShowMobileCart(true)}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ShoppingCart size={26} />
          {totalItems > 0 && (
            <div style={styles.cartBadge}>{totalItems}</div>
          )}
        </button>

        {/* Mobile Overlay */}
        <div 
          style={styles.mobileOverlay}
          onClick={() => setShowMobileCart(false)}
        />

        {/* Mobile Order Panel (bottom sheet) */}
        {showMobileCart && (
          <div className="mobile-order-panel">
            <OrderPanel 
              onClose={() => setShowMobileCart(false)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;