// types/colorthief.d.ts
declare module "colorthief" {
    export function getPalette(
        image: string | Buffer,
        colorCount: number
    ): Promise<[number, number, number][]>;
}
