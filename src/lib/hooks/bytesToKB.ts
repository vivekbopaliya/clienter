export function bytesToKilobytes(bytesValue: any){
    return (bytesValue / 1024).toFixed(2) + ' KB';
}