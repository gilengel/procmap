export function CreateNowTimestamp(): number {
  return CreateDateTimestamp(new Date());
}

export function CreateDateTimestamp(date: Date): number {
  return parseInt(date.toJSON().slice(0, -1));
}
