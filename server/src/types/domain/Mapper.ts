export interface Mapper<TEntity, TPrimitive, TDTO> {
  toPersistence(entity: TEntity): TPrimitive;
  toDTO(entity: TEntity): TDTO;
  toDomain(rawEntity: TPrimitive, ...args: any[]): TEntity;
}
