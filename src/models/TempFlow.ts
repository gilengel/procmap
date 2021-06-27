export interface TempFlow {
  flow_pk: number,
  flow_id: string,
  name: string,
  created_at: number,
  data: Record<string, unknown>,
}
