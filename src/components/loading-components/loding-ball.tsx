// components/loading-components/LoadingBalls.tsx
import React from 'react';
import styles from './loading-ball.module.css';

const LoadingBalls: React.FC = () => {
  const renderBalls = (group: 1 | 2) => (
    <div className={`${styles.balls} ${styles[`balls-${group}`]}`}>
      {[1, 2, 3, 4, 5].map((num) => (
        <div
          key={`${group}-${num}`}
          className={`${styles.ball} ${styles[`ball--${num}`]}`}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.main}>
      {renderBalls(1)}
      {renderBalls(2)}
    </div>
  );
};

export default LoadingBalls;
