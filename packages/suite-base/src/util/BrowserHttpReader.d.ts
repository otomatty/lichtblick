import { FileReader, FileStream } from "@lichtblick/suite-base/util/CachedFilelike";
export default class BrowserHttpReader implements FileReader {
    #private;
    constructor(url: string);
    open(): Promise<{
        size: number;
        identifier?: string;
    }>;
    fetch(offset: number, length: number): FileStream;
}
