import { HemiSync } from '@/modules/common/soundGenerator';

export const SoundGenerator = () => {
    const hemy = new HemiSync(200, 7);

    return (
        <>
  
        <input
        type="range"
        id="volume"
        min="0"
        max="100"
        step="1"
        onChange={(e) => hemy.setVolume(e.target.valueAsNumber)}
        />
        <button onClick={() => hemy.play()}>Play</button>
        <button onClick={() => hemy.stop()}>Stop</button>
      </>
      )
};

