import { Writable } from 'stream';
import pino from 'pino';
export declare class CloudWatchStream extends Writable {
    _write(chunk: any, _encoding: string, callback: Function): void;
}
export declare const createCloudLogger: (streams?: Writable[]) => pino.Logger<never, boolean>;
