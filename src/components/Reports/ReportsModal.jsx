import { useState } from 'react';
import { COLORS, SPACING } from '../../theme/colors';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import SalesStats from './SalesStats';
import { usePOS } from '../../hooks/usePOS';
import { getTodayTransactions, getTransactionsByDateRange } from '../../utils/storage';
import { getStartOfWeek, getStartOfMonth, getTomorrow } from '../../utils/dateUtils';

// Inline Styles
const styles = {
  reportFilters: {
    display: 'flex',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  reportDisplay: {
    background: COLORS.gray100,
    padding: SPACING.lg,
    borderRadius: '10px',
    minHeight: '200px',
  },
};

const ReportsModal = () => {
  const { showReportsModal, setShowReportsModal } = usePOS();
  const [reportPeriod, setReportPeriod] = useState('today');
  const [transactions, setTransactions] = useState(() => getTodayTransactions());

  const loadReport = (period) => {
    setReportPeriod(period);
    
    let data = [];
    const tomorrow = getTomorrow();

    switch (period) {
      case 'today':
        data = getTodayTransactions();
        break;
      case 'week':
        data = getTransactionsByDateRange(getStartOfWeek(), tomorrow);
        break;
      case 'month':
        data = getTransactionsByDateRange(getStartOfMonth(), tomorrow);
        break;
      default:
        data = getTodayTransactions();
    }
    
    setTransactions(data);
  };

  return (
    <Modal 
      isOpen={showReportsModal} 
      onClose={() => setShowReportsModal(false)} 
      title="Sales Reports"
    >
      <div style={styles.reportFilters}>
        <Button 
          variant={reportPeriod === 'today' ? 'primary' : 'secondary'}
          onClick={() => loadReport('today')}
        >
          Today
        </Button>
        <Button 
          variant={reportPeriod === 'week' ? 'primary' : 'secondary'}
          onClick={() => loadReport('week')}
        >
          This Week
        </Button>
        <Button 
          variant={reportPeriod === 'month' ? 'primary' : 'secondary'}
          onClick={() => loadReport('month')}
        >
          This Month
        </Button>
      </div>

      <div style={styles.reportDisplay}>
        <SalesStats transactions={transactions} />
      </div>
    </Modal>
  );
};

export default ReportsModal;