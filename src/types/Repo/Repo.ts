interface Repo<T> {
  exists(t: T): Promise<boolean>;
  delete(t: T): Promise<any>;
  create(t: T): Promise<any>;
}

export type { Repo };
