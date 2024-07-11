export class KnowledgeBaseUpdatedEvent {
  readonly assistantId: string;

  constructor(assistantId: string) {
    this.assistantId = assistantId;
  }
}
