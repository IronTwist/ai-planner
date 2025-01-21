'use client';

import { HemiSync } from '@/modules/common/soundGenerator';
import { Suspense, useEffect, useRef } from 'react';

export const Loading = () => <div>Loading</div>;

export const SoundGenerator = () => {
  const hemyRef = useRef<HemiSync | null>(null);

  useEffect(() => {
    hemyRef.current = new HemiSync(200, 7);
  }, [hemyRef]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      hemyRef.current = new HemiSync(200, 7);
    }
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <div
        style={{
          display: 'flex',
          border: '1px solid white',
          margin: '2px',
          position: 'absolute',
          top: 'auto',
          bottom: '10px',
          left: '100px',
          gap: '20px',
          padding: '5px',
        }}
      >
        <div>Sound generator (Mozzila browser)</div>
        <input
          type='range'
          id='volume'
          min='0'
          max='100'
          step='1'
          onChange={e => hemyRef?.current?.setVolume(e.target.valueAsNumber)}
        />
        <button onClick={() => hemyRef?.current?.play()}>Play</button>
        <button onClick={() => hemyRef?.current?.stop()}>Stop</button>
      </div>
    </Suspense>
  );
};
