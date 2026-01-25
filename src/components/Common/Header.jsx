import { useState, useEffect } from 'react';
import { COLORS, SHADOWS, RADIUS, SPACING, FONTS } from '../../theme/colors';
import { SETTINGS } from '../../data/menuItems';
import { formatDate, formatTime } from '../../utils/dateUtils';

const styles = {
  header: {
    background: COLORS.white,
    padding: `${SPACING.lg} ${SPACING.xl}`,
    borderRadius: RADIUS.large,
    marginBottom: SPACING.lg,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: SHADOWS.medium,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.huge,
    fontWeight: '600',
    margin: 0,
  },
  headerInfo: {
    display: 'flex',
    gap: SPACING.lg,
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },
  dateTime: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
};

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <style>{`
        /* Tablet: 768px - 1024px */
        @media (max-width: 1024px) and (min-width: 768px) {
          .common-header {
            padding: 16px 24px !important;
            margin-bottom: 16px !important;
          }
          .common-header-title {
            font-size: 24px !important;
          }
          .common-header-info {
            font-size: 11px !important;
          }
        }

        /* Mobile: 480px - 768px */
        @media (max-width: 768px) {
          .common-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            padding: 16px 20px !important;
            margin-bottom: 16px !important;
          }
          .common-header-title {
            font-size: 22px !important;
          }
          .common-header-info {
            width: 100% !important;
            justify-content: space-between !important;
            font-size: 12px !important;
          }
          .common-header-datetime {
            align-items: flex-start !important;
          }
        }

        /* Small Mobile: < 480px */
        @media (max-width: 480px) {
          .common-header {
            padding: 14px 16px !important;
            margin-bottom: 14px !important;
            border-radius: 10px !important;
          }
          .common-header-title {
            font-size: 20px !important;
            line-height: 1.2 !important;
          }
          .common-header-info {
            font-size: 11px !important;
          }
        }
      `}</style>

      <header style={styles.header} className="common-header">
        <h1 style={styles.title} className="common-header-title">
          🥪 {SETTINGS.shopName}
        </h1>
        <div style={styles.headerInfo} className="common-header-info">
          <div style={styles.dateTime} className="common-header-datetime">
            <span>{formatDate(currentTime)}</span>
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;