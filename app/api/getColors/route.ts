import { NextResponse } from "next/server";
import axios from "axios";
import { getImages } from "icloud-shared-album";
import sharp from "sharp";
import Vibrant from "node-vibrant";

const ALBUM_TOKEN = "B0gGY8gBYGlMqnw";

const getProminentColors = async (
    imgUrl: string,
    initialColorCount = 20,
    finalColorCount = 10
) => {
    const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    const image = sharp(buffer);
    const { width, height } = await image.metadata();

    // Ensure the image is in a format that Vibrant can handle
    const imageBuffer = await image.toFormat("jpeg").toBuffer();
    const palette = await Vibrant.from(imageBuffer).getPalette();

    const isNonNeutralColor = (swatch: Vibrant.Swatch) => {
        const rgb = swatch.getRgb();
        const [r, g, b] = rgb;
        const isGray =
            Math.abs(r - g) < 10 &&
            Math.abs(g - b) < 10 &&
            Math.abs(b - r) < 10;
        const isBlack = r < 50 && g < 50 && b < 50;
        const isWhite = r > 200 && g > 200 && b > 200;
        return !(isGray || isBlack || isWhite);
    };

    const vibrantScore = (swatch: Vibrant.Swatch) => {
        const rgb = swatch.getRgb();
        const [r, g, b] = rgb;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        return max - min;
    };

    let allColors = Object.values(palette)
        .filter((swatch) => swatch && isNonNeutralColor(swatch))
        .sort((a, b) => vibrantScore(b) - vibrantScore(a))
        .slice(0, initialColorCount);

    const uniqueColors = new Set();
    for (const swatch of allColors) {
        uniqueColors.add(swatch?.getHex());
        if (uniqueColors.size >= finalColorCount) break;
    }

    return {
        colors: Array.from(uniqueColors).slice(0, finalColorCount),
        width,
        height,
    };
};

export async function GET() {
    try {
        const data = await getImages(ALBUM_TOKEN);
        const imageUrls = data.photos.map((photo: any) => {
            const bestDerivative = Object.values(photo.derivatives).reduce(
                (prev: any, curr: any) =>
                    curr.width > (prev.width || 0) ? curr : prev,
                {}
            );
            return {
                url: bestDerivative.url,
                width: bestDerivative.width,
                height: bestDerivative.height,
            };
        });

        console.log("Fetched image URLs:", imageUrls);

        let prominentColors = new Set<string>();
        let imageData = [];

        for (const { url, width, height } of imageUrls) {
            const { colors } = await getProminentColors(url);
            colors.forEach((color) => prominentColors.add(color));
            imageData.push({ url, width, height, color: colors[0] });
        }

        console.log("Final image data:", imageData);

        return NextResponse.json({
            colors: Array.from(prominentColors).slice(0, 10),
            imageData,
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json({ colors: [], imageData: [] });
    }
}
