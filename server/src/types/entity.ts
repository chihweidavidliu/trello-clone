export abstract class Entity<T extends { id: string }> {
  protected readonly _id: string;
  protected props: T;

  constructor(props: T) {
    (this._id = props.id), (this.props = props);
  }

  // other common methods here...
}
