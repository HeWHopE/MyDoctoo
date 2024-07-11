import { useState, useRef, useEffect } from 'react';

interface MediaOptions {
  withAudioOn: boolean;
  withVideoOn: boolean;
  request: boolean;
}

export const useMedia = (
  options: MediaOptions = {
    withAudioOn: false,
    withVideoOn: false,
    request: false,
  },
) => {
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const [mediaStreamState, setMediaStreamState] = useState<MediaStream | null>(null);

  const currentSettings = useRef({ video: false, audio: false });

  useEffect(() => {
    if (!options.request) return;
    setIsAudioOn(options.withAudioOn);
    setIsVideoOn(options.withVideoOn);
    currentSettings.current = { video: options.withVideoOn, audio: options.withAudioOn };
    setStream();
    return () => {
      close();
    };
  }, [options.withAudioOn, options.withVideoOn, options.request]);

  const setStream = async () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStream.current = null;
    }

    const localStream = await window.navigator.mediaDevices
      .getUserMedia({ video: currentSettings.current.video, audio: true })
      .catch(() => null);
    if (!localStream) return;

    mediaStream.current = localStream;
    setMediaStreamState(localStream);
    if (videoRef.current) videoRef.current.srcObject = localStream;
  };

  const handleVideoToggle = async () => {
    setIsVideoOn(!isVideoOn);
    currentSettings.current.video = !currentSettings.current.video;
    await setStream();
  };

  const handleAudioToggle = async () => {
    setIsAudioOn(!isAudioOn);
    currentSettings.current.audio = !currentSettings.current.audio;
    // Somehow audio is not working after video was turned off
    if (!mediaStream.current || !currentSettings.current.video) await setStream();
    else
      mediaStream.current!.getAudioTracks().forEach(track => {
        track.enabled = currentSettings.current.audio;
      });
  };

  const close = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStream.current = null;
      setMediaStreamState(null);

      setIsAudioOn(false);
      setIsVideoOn(false);
      currentSettings.current = { video: false, audio: false };
    }
  };

  return {
    mediaStream: mediaStreamState,
    videoRef,
    isAudioOn,
    isVideoOn,
    close,
    handleVideoToggle,
    handleAudioToggle,
  };
};
