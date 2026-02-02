
import { useCallback, useMemo } from 'react';

const CORRECT_URL = 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3';
const WRONG_URL = 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3';
const POP_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

export const useGameSound = () => {
  const correctAudio = useMemo(() => new Audio(CORRECT_URL), []);
  const wrongAudio = useMemo(() => new Audio(WRONG_URL), []);
  const popAudio = useMemo(() => new Audio(POP_URL), []);

  const playCorrect = useCallback(() => {
    correctAudio.currentTime = 0;
    correctAudio.volume = 0.5;
    correctAudio.play().catch(() => {}); // Catch browser autoplay blocks
  }, [correctAudio]);

  const playWrong = useCallback(() => {
    wrongAudio.currentTime = 0;
    wrongAudio.volume = 0.4;
    wrongAudio.play().catch(() => {});
  }, [wrongAudio]);

  const playPop = useCallback(() => {
    popAudio.currentTime = 0;
    popAudio.volume = 0.3;
    popAudio.play().catch(() => {});
  }, [popAudio]);

  return { playCorrect, playWrong, playPop };
};

export default useGameSound;
