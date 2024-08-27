import { bgColors } from "@/data/style";

export function generateRandomUsernamePassword(name: string): [string, string] {
    const randomNumber = (): number => {
      return Math.floor(Math.random() * 10000); // Generates a random number between 0 and 9999
    };
  
    const randomString = (length: number): string => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
  
    const uniqueNumber = randomNumber();
    const username: string = `${name}.${uniqueNumber}.pointer`; // Username format: name.uniquenumber.pointer
    const password: string = randomString(12); // Generates a random password with 12 characters
  
    return [username, password];
  }
  
export const fetcher = (url: string, id: number | undefined) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
}).then(res => res.json());


export const generateUniqueId = (): number => {
  const min = 100000000; // Smallest 6-digit number
  const max = 999999999; // Largest 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomBgColor = () => {
  const randomIndex = Math.floor(Math.random() * bgColors.length);
  return bgColors[randomIndex];
};

export const getRandomIcon = (gender: string, iconsCount: number) => {

  let randomIndex = Math.floor(Math.random() * iconsCount) + 1;
  let type = gender === "male" ? "boy" : "girl";
  let icon = `/icons/${type}_${randomIndex}.png`;
  return icon;
}

export const assertInt = (input : any) : number => {
  return typeof input === "string"? parseInt(input, 10) : input;
}