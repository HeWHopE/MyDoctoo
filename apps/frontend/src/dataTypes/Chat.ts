import type { paths } from '@/api';

export type TChats = paths['/chat']['get']['responses']['200']['content']['application/json'];

export type TChat = paths['/chat/{chatId}']['get']['responses']['200']['content']['application/json'];

export type TParticipant = TChat['participant'];

export type TMessages = paths['/chat/{chatId}/messages']['get']['responses']['200']['content']['application/json'];

export type TMessage = TMessages['messages'][0];

export type TMessageAppointment = TMessage['appointment'];

export type TAttachments =
  paths['/chat/{chatId}/attachments']['get']['responses']['200']['content']['application/json'];

export type TAttachment = TAttachments['attachments'][0];

export type TSearchedChats = paths['/chat/search']['get']['responses']['200']['content']['application/json'];

export type TChatMessagesSearchResult = TSearchedChats['messagesSearchResults'][0];
