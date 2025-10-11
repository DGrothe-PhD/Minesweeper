import { Flag } from '@phosphor-icons/react';
import { memo } from 'react';
import type { RemainingFlagsCounterProps } from '@feature/RemainingFlagsCounter/RemainingFlagsCounter.interface';
import styles from '@feature/RemainingFlagsCounter/RemainingFlagsCounter.module.css';

function RemainingFlagsCounter({
  remainingFlagsCount,
}: RemainingFlagsCounterProps) {
  return (
    <div id={styles.remainingFlagsCounter} data-testid='flags-remaining'>
      <Flag size={25} color='#c01c28' weight='fill' aria-hidden='true' />
      <span id={styles.remainingFlagsLabel}>Remaining Flags:</span>
      <span id={styles.remainingFlagsCount}>{remainingFlagsCount}</span>
    </div>
  );
}

export default memo(RemainingFlagsCounter);
