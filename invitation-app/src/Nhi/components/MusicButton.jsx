import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";

const MusicButton = forwardRef(function MusicButton({ src }, ref) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play() {
      if (audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    },
    pause() {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlaying(false);
      }
    },
    get isPlaying() { return playing; },
  }));

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <button
        className={`nhi-music-btn${playing ? " playing" : ""}`}
        onClick={toggle}
        title="Bật/Tắt nhạc"
      >
        🎵
      </button>
    </>
  );
});

export default MusicButton;
