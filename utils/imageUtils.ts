/**
 * 将 base64 data URI 转换为 File 对象
 * @param dataUri - base64 data URI (例如: "data:image/png;base64,...")
 * @param filename - 输出文件名
 * @returns File 对象
 */
export function base64ToFile(dataUri: string, filename: string): File {
    // 解析 data URI
    const [header, base64Data] = dataUri.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";

    // 解码 base64 为二进制
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // 创建 File 对象
    return new File([bytes], filename, { type: mimeType });
}
