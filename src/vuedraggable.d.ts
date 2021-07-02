declare module 'vuedraggable' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface draggable {}

  export type ChangeEvent<T> = {
    added?: {
      element: T;
      newIndex: number;
    };
    removed?: {
      element: T;
      oldIndex: number;
    };
    moved?: {
      element: T;
      newIndex: number;
      oldIndex: number;
    };
  };
}
