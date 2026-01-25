import { COLORS, RADIUS, SPACING, FONTS, TRANSITIONS } from '../../theme/colors';
import { usePOS } from '../../hooks/usePOS';

// Inline Styles
const getTabStyles = (isActive) => ({
  flex: 1,
  padding: `${SPACING.md} ${SPACING.lg}`,
  border: 'none',
  borderRadius: RADIUS.medium,
  fontSize: FONTS.large,
  fontWeight: '600',
  cursor: 'pointer',
  transition: `all ${TRANSITIONS.medium}`,
  background: isActive
    ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`
    : COLORS.gray100,
  color: isActive ? COLORS.white : COLORS.textPrimary,
  transform: isActive ? 'scale(1.05)' : 'scale(1)',
  boxShadow: isActive ? '0 5px 15px rgba(0,0,0,0.2)' : 'none',
});

const getSubTabStyles = (isActive) => ({
  flex: 1,
  padding: `${SPACING.sm} ${SPACING.md}`,
  border: 'none',
  borderRadius: RADIUS.small,
  fontSize: FONTS.medium,
  fontWeight: '600',
  cursor: 'pointer',
  transition: `all ${TRANSITIONS.fast}`,
  background: isActive
    ? COLORS.primary
    : COLORS.gray200,
  color: isActive ? COLORS.white : COLORS.textPrimary,
});

const styles = {
  tabsContainer: {
    display: 'flex',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  subTabsContainer: {
    display: 'flex',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
  },
};

const CategoryTabs = () => {
  const { activeCategory, setActiveCategory } = usePOS();

  const mainTabs = [
    { id: 'sandwiches', label: 'Sandwiches', icon: '🥪' },
    { id: 'drinks', label: 'Drinks', icon: '🥤' },
  ];

  const drinkSubTabs = [
    { id: 'coffee', label: 'Coffee' },
    { id: 'fruittea500', label: 'Fruit Tea 500ml' },
    { id: 'fruittea700', label: 'Fruit Tea 700ml' },
    { id: 'milktea500', label: 'Milk Tea 500ml' },
    { id: 'milktea700', label: 'Milk Tea 700ml' },
  ];

  const currentMainTab = ['sandwiches'].includes(activeCategory) ? 'sandwiches' : 'drinks';
  const isDrinksTab = currentMainTab === 'drinks';

  const handleMainTabClick = (tabId) => {
    if (tabId === 'sandwiches') {
      setActiveCategory('sandwiches');
    } else {
      // Default to coffee when switching to drinks
      setActiveCategory('coffee');
    }
  };

  const handleMouseEnter = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.background = COLORS.gray200;
    }
  };

  const handleMouseLeave = (e, isActive) => {
    if (!isActive) {
      e.currentTarget.style.background = COLORS.gray100;
    }
  };

  return (
    <div>
      {/* Main Tabs */}
      <div style={styles.tabsContainer}>
        {mainTabs.map(tab => {
          const isActive = tab.id === currentMainTab;
          return (
            <button
              key={tab.id}
              style={getTabStyles(isActive)}
              onClick={() => handleMainTabClick(tab.id)}
              onMouseEnter={(e) => handleMouseEnter(e, isActive)}
              onMouseLeave={(e) => handleMouseLeave(e, isActive)}
            >
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Drink Sub-Tabs */}
      {isDrinksTab && (
        <div style={styles.subTabsContainer}>
          {drinkSubTabs.map(subTab => {
            const isActive = activeCategory === subTab.id;
            return (
              <button
                key={subTab.id}
                style={getSubTabStyles(isActive)}
                onClick={() => setActiveCategory(subTab.id)}
              >
                {subTab.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;