import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingCart, X, Package } from 'lucide-react';
import CategoryPills from '../../components/Menu/CategoryPills';
import MenuGrid from '../../components/Menu/MenuGrid';
import OrderPanel from '../../components/Order/OrderPanel';
import { usePOS } from '../../hooks/usePOS';

const HomePage = () => {
  const { theme } = useTheme();
  const { currentOrder, activeCategory } = usePOS();
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
    
    // Empty state
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '40px 20px',
      textAlign: 'center',
    },
    emptyIcon: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: theme.bgSecondary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '24px',
    },
    emptyTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: '12px',
    },
    emptyDescription: {
      fontSize: '16px',
      color: theme.textSecondary,
      maxWidth: '400px',
      lineHeight: '1.5',
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
      display: showMobileCart ? 'block' : 'none',
    },
    
    // Mobile modal wrapper
    mobileModalWrapper: {
      position: 'fixed',
      inset: 0,
      display: showMobileCart ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
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
          
          .mobile-modal-wrapper {
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
            
            /* Mobile cart centered modal wrapper */
            .mobile-modal-wrapper {
              position: fixed !important;
              inset: 0 !important;
              display: ${showMobileCart ? 'flex' : 'none'} !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 100 !important;
              padding: 20px !important;
            }
            
            .mobile-order-panel-container {
              width: 90% !important;
              max-width: 480px !important;
              max-height: 85vh !important;
              border-radius: 20px !important;
              overflow: hidden !important;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
              opacity: ${showMobileCart ? '1' : '0'};
              transform: scale(${showMobileCart ? '1' : '0.95'});
              transition: all 0.3s ease !important;
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
            
            .mobile-modal-wrapper {
              padding: 16px !important;
            }
            
            .mobile-order-panel-container {
              width: 92% !important;
              max-height: 82vh !important;
            }
            
            .empty-icon-mobile {
              width: 100px !important;
              height: 100px !important;
            }
            
            .empty-title-mobile {
              font-size: 20px !important;
            }
            
            .empty-description-mobile {
              font-size: 14px !important;
            }
          }

          /* Small Mobile: Even more compact */
          @media (max-width: 480px) {
            .mobile-cart-btn {
              width: 52px !important;
              height: 52px !important;
            }
            
            .mobile-modal-wrapper {
              padding: 12px !important;
            }
            
            .mobile-order-panel-container {
              width: 94% !important;
              max-height: 88vh !important;
            }
            
            .empty-icon-mobile {
              width: 80px !important;
              height: 80px !important;
            }
            
            .empty-title-mobile {
              font-size: 18px !important;
            }
            
            .empty-description-mobile {
              font-size: 13px !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Left Section: Categories + Menu */}
        <div className="home-left-section" style={styles.leftSection}>
          <CategoryPills />
          <div style={styles.menuArea} className="menu-scrollable">
            {!activeCategory ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon} className="empty-icon-mobile">
                  <Package size={60} color={theme.textSecondary} />
                </div>
                <div style={styles.emptyTitle} className="empty-title-mobile">
                  Select a Category
                </div>
                <div style={styles.emptyDescription} className="empty-description-mobile">
                  Choose a category from above to view available menu items
                </div>
              </div>
            ) : (
              <MenuGrid />
            )}
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

        {/* Mobile Order Panel (centered modal) */}
        <div className="mobile-modal-wrapper" style={styles.mobileModalWrapper}>
          <div className="mobile-order-panel-container">
            <OrderPanel 
              onClose={() => setShowMobileCart(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;