import { loadScript } from "./lib-franklin.js"

let slickLoaded = false;

export async function loadSlick() {
    if (slickLoaded) return;
    const jqScript = loadScript('/scripts/jquery-3.6.3.min.js');
    await new Promise((resolve) => jqScript.addEventListener('load', resolve));
    const slickScript = loadScript('/scripts/slick-1.8.1.min.js');
    await new Promise((resolve) => slickScript.addEventListener('load', resolve));
    slickLoaded = true;
}