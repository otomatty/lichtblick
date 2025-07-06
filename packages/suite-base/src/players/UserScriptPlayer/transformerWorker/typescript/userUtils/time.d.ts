import { Time } from "./types";
export declare const areSame: (t1: Time, t2: Time) => boolean;
export declare const compare: (left: Time, right: Time) => number;
export declare const subtractTimes: ({ sec: sec1, nsec: nsec1 }: Time, { sec: sec2, nsec: nsec2 }: Time) => Time;
