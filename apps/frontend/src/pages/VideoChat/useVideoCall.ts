import { useRef, useEffect, useState } from 'react';
import { type UserCombined, VideoSignalingChannel } from './SignalingChannel';

const defConfig = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
    {
      urls: ['turn:numb.viagenie.ca'],
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
  ],
  iceCandidatePoolSize: 10,
};

interface VideoCallProps {
  conferenceId: string;
  conf?: RTCConfiguration;
  userId: string;
  withAudioOn: boolean;
  withVideoOn: boolean;
}

export const useVideoCall = ({ conferenceId, conf = defConfig, withAudioOn, withVideoOn, userId }: VideoCallProps) => {
  const firstRender = useRef(true);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const signalingChannelRef = useRef<VideoSignalingChannel>();

  const [joinedMemebers, setJoinedMembers] = useState<UserCombined[]>([]);

  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const iceCandidates = useRef<RTCIceCandidateInit[]>([]);
  const [error, setError] = useState<string | null | undefined>(null);

  const [isRemoteVideoOn, setIsRemoteVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const requestLocalStream = async () => {
    const stream = await navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { min: 854, ideal: 1920, max: 3200 },
          height: { min: 480, ideal: 1080, max: 1800 },
        },
        audio: true,
      })
      .catch(() => null);
    localStreamRef.current = stream;
    localRef.current!.srcObject = localStreamRef.current;

    if (!withAudioOn && isAudioOn) {
      toggleAudio();
      setIsAudioOn(false);
    }
    if (!withVideoOn && isVideoOn) {
      toggleVideo();
      setIsVideoOn(false);
    }
  };

  const init = async () => {
    signalingChannelRef.current = new VideoSignalingChannel();
    const joinResponse = await signalingChannelRef.current.join({ conferenceId });
    setJoinedMembers(joinResponse.members.filter(u => u.data.userId !== userId));
    setError(joinResponse.error);

    signalingChannelRef.current.onMemberJoined(async joinedUser => {
      await createOffer(joinedUser.data.userId);
      setJoinedMembers(prev => {
        const user = prev.find(u => u.data.userId === joinedUser.data.userId);
        if (user) return prev;
        return [...prev, joinedUser];
      });

      setIsVideoOn(prev => {
        signalingChannelRef.current!.sendVideoState({ conferenceId, isVideoOn: prev });
        return prev;
      });
    });

    signalingChannelRef.current.onMemberLeft(leftUserId => {
      setJoinedMembers(prev => prev.filter(u => u.data.userId !== leftUserId));
      peerRef.current?.close();
    });

    signalingChannelRef.current.onRemoteICECandidate(async candidate => {
      if (peerRef.current) {
        if (peerRef.current.remoteDescription) await peerRef.current.addIceCandidate(candidate);
        else iceCandidates.current.push(candidate);
      }
    });

    signalingChannelRef.current.onRemoteOffer(async (offer, memberId) => {
      await createAnswer(memberId, offer);
    });

    signalingChannelRef.current.onRemoteOfferAnswer(async answer => {
      await peerRef.current!.setRemoteDescription(answer);
      addIceCandidatesFromQueue();
    });

    signalingChannelRef.current.onVideoState(({ isVideoOn }) => {
      setIsRemoteVideoOn(isVideoOn);
    });

    await requestLocalStream();
  };

  const addIceCandidatesFromQueue = async () => {
    while (iceCandidates.current.length) {
      const candidate = iceCandidates.current.shift();
      if (candidate) await peerRef.current!.addIceCandidate(candidate);
    }
  };

  const createPeerConnection = async (memberId: string) => {
    const peerConnectionn = new RTCPeerConnection(conf);
    peerRef.current = peerConnectionn;

    peerRef.current.oniceconnectionstatechange = () => {
      console.warn('ice connection state', peerConnectionn.iceConnectionState);
    };

    const remoteStream = new MediaStream();
    remoteRef.current!.srcObject = remoteStream;
    remoteStreamRef.current = remoteStream;

    if (!localStreamRef.current) await requestLocalStream();
    if (!localStreamRef.current) {
      setError('Please, allow access to your camera and microphone.');
      return;
    }
    localStreamRef.current.getTracks().forEach(track => peerConnectionn.addTrack(track, localStreamRef.current!));

    peerConnectionn.ontrack = event => {
      event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
    };

    peerConnectionn.onicecandidate = event => {
      const { candidate } = event;
      if (!candidate) return;
      signalingChannelRef.current!.sendICECandidate({ candidate, conferenceId, memberId });
    };
  };

  const createOffer = async (memberId: string) => {
    await createPeerConnection(memberId);

    const offer = await peerRef.current!.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await peerRef.current!.setLocalDescription(offer);

    signalingChannelRef.current!.sendOffer({ offer, memberId, conferenceId });
  };

  const createAnswer = async (memberId: string, offer: RTCSessionDescriptionInit) => {
    await createPeerConnection(memberId);

    await peerRef.current!.setRemoteDescription(offer);

    const answer = await peerRef.current!.createAnswer();
    await peerRef.current!.setLocalDescription(answer);

    addIceCandidatesFromQueue();

    signalingChannelRef.current!.sendAnswer({ answer, conferenceId, memberId });
  };

  const leaveCall = () => {
    signalingChannelRef.current!.leave({ conferenceId });
    signalingChannelRef.current!.close();
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    remoteStreamRef.current?.getTracks().forEach(track => track.stop());
    peerRef.current?.close();

    iceCandidates.current = [];
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    peerRef.current = null;
  };

  const toggleVideo = () => {
    if (isScreenSharing) return;
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    signalingChannelRef.current!.sendVideoState({ conferenceId, isVideoOn: videoTrack.enabled });
    setIsVideoOn(videoTrack.enabled);
  };

  const toggleAudio = () => {
    localStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsAudioOn(track.enabled);
    });
  };

  const shareScreen = async () => {
    if (!localStreamRef.current || isScreenSharing) return;
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = screenStream.getVideoTracks()[0];
    const localTrack = localStreamRef.current.getVideoTracks()[0];

    peerRef.current?.getSenders().forEach(sender => {
      if (sender.track?.kind === 'video') sender.replaceTrack(screenTrack);
    });
    signalingChannelRef.current!.sendVideoState({ conferenceId, isVideoOn: true });
    localStreamRef.current.removeTrack(localTrack);
    localStreamRef.current.addTrack(screenTrack);

    screenTrack.onended = () => {
      peerRef.current?.getSenders().forEach(sender => {
        if (sender.track?.kind === 'video') sender.replaceTrack(localTrack);
      });
      localStreamRef.current?.removeTrack(screenTrack);
      localStreamRef.current?.addTrack(localTrack);
      screenTrack.onended = null;
      setIsScreenSharing(false);
      signalingChannelRef.current!.sendVideoState({ conferenceId, isVideoOn: isVideoOn });
    };

    setIsScreenSharing(true);
  };

  useEffect(() => {
    if (firstRender.current && import.meta.env.MODE === 'development') {
      firstRender.current = false;
      return;
    }
    init();
    window.addEventListener('beforeunload', leaveCall);
    return () => {
      window.removeEventListener('beforeunload', leaveCall);
      leaveCall();
    };
  }, []);

  return {
    localRef,
    remoteRef,
    leaveCall,
    joinedMemebers,
    toggleVideo,
    toggleAudio,
    shareScreen,
    isScreenSharing,
    isAudioOn,
    isVideoOn,
    isRemoteVideoOn,
    error,
  };
};
