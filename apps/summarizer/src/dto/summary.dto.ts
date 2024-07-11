export class Position {
  constructor(
    readonly start: number,
    readonly end: number,
  ) {}
}

export class Complaint {
  constructor(
    readonly name: string,
    readonly position: Position,
  ) {}
}

export class BodyPart {
  constructor(
    readonly name: string,
    readonly position: Position,
  ) {}
}

export class SummaryDto {
  complaints: Complaint[] = [];
  problematicBodyParts: BodyPart[] = [];
}
