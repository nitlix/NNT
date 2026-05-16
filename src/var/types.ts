//===================================
// Add your custom types here.
//===================================

import Lenis from "lenis";
import createDb from "../db/createDb";

export type AsyncReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
) => Promise<infer R>
    ? R
    : any;
export type SearchParams = Promise<{
    [key: string]: string | string[] | undefined;
}>;
export type LenisScrolltoProperties = NonNullable<
    Parameters<Lenis["scrollTo"]>[1]
>;

export type ThemeStyle = "dark" | "light";
export type ThemeTheme = ThemeStyle | "system";

export type DB = ReturnType<typeof createDb>;

export type QueryArgs<T extends keyof DB['query']> =
    Parameters<DB['query'][T]['findFirst']>[0];