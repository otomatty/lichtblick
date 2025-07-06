import { IteratorResult } from "@lichtblick/suite-base/players/IterablePlayer/IIterableSource";
export declare function mergeAsyncIterators<T extends IteratorResult>(iterators: AsyncIterableIterator<T>[]): AsyncIterableIterator<T>;
