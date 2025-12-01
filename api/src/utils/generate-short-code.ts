export function generateShortCode(lenght = 6): string {
  const charSet =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let retVal = "";
  for (let i = 0, n = charSet.length; i < lenght; ++i) {
    retVal += charSet.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
}
