
export const emptyImageData = (() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    return ctx.createImageData(1, 1);
})();

export function getClientRect(elem) {
    const cw = elem.clientWidth;
    const ch = elem.clientHeight;
    const rect = elem.getBoundingClientRect();
    rect.x=((rect.x) + ((rect.width - cw) * 0.5));
    rect.y=((rect.y) + ((rect.height - ch) * 0.5));
    rect.width = cw;
    rect.height = ch;
    return rect;
}

