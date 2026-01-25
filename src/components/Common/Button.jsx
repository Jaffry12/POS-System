import { COLORS, RADIUS, SPACING, FONTS, TRANSITIONS } from '../../theme/colors';

const getButtonStyles = (variant, fullWidth) => {
  const baseStyles = {
    padding: `${SPACING.md} ${SPACING.lg}`,
    border: 'none',
    borderRadius: RADIUS.medium,
    fontSize: FONTS.medium,
    fontWeight: '600',
    cursor: 'pointer',
    transition: `all ${TRANSITIONS.medium}`,
    width: fullWidth ? '100%' : 'auto',
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
      color: COLORS.white,
    },
    success: {
      background: `linear-gradient(135deg, ${COLORS.success} 0%, ${COLORS.successLight} 100%)`,
      color: COLORS.white,
    },
    danger: {
      background: COLORS.danger,
      color: COLORS.white,
    },
    secondary: {
      background: COLORS.gray200,
      color: COLORS.textPrimary,
    },
    outline: {
      background: 'transparent',
      border: `2px solid ${COLORS.primary}`,
      color: COLORS.primary,
    },
  };

  return { ...baseStyles, ...variants[variant] };
};

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false,
  disabled = false,
  style = {} 
}) => {
  const buttonStyle = {
    ...getButtonStyles(variant, fullWidth),
    ...style,
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
    }
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default Button;


