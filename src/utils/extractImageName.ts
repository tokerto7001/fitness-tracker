
export function extractImageName(imageUrl: string){
    const pattern = /fitness-tracker\/(.+)/;
    const match = imageUrl.match(pattern);
    return match ? match[1] : null;
}