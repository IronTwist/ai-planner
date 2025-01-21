'use client';

import { HemiSync } from '@/modules/common/soundGenerator';

export const SoundGenerator = () => {
  const hemy = new HemiSync(200, 7);

  return (
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
      <div>Sound generator</div>
      <input
        type='range'
        id='volume'
        min='0'
        max='100'
        step='1'
        onChange={e => hemy.setVolume(e.target.valueAsNumber)}
      />
      <button onClick={() => hemy.play()}>Play</button>
      <button onClick={() => hemy.stop()}>Stop</button>
    </div>
  );
};
