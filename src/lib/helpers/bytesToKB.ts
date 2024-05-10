// Bytes to KB conversaion to store easily readbale file size in DB

export function bytesToKilobytes(bytesValue: any){
    return (bytesValue / 1024).toFixed(2) + ' KB';
}