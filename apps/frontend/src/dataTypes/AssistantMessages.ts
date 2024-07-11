import type { paths } from '@/api';

export type TAssistantMessage =
  paths['/virtual-assistant/get-message/{messageId}']['get']['responses']['200']['content']['application/json'];
