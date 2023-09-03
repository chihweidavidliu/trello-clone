// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.board */
export type BoardId = string & { __brand: 'BoardId' };

/** Represents the table public.board */
export default interface Board {
  id: BoardId;

  title: string;

  createdByUserId: string;

  createdAt: Date;

  updatedAt: Date;
}

/** Represents the initializer for the table public.board */
export interface BoardInitializer {
  /** Default value: uuid_generate_v4() */
  id?: BoardId;

  title: string;

  createdByUserId: string;

  /** Default value: CURRENT_TIMESTAMP */
  createdAt?: Date;

  /** Default value: CURRENT_TIMESTAMP */
  updatedAt?: Date;
}

/** Represents the mutator for the table public.board */
export interface BoardMutator {
  id?: BoardId;

  title?: string;

  createdByUserId?: string;

  createdAt?: Date;

  updatedAt?: Date;
}