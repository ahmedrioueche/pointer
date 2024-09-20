import { bgColors } from "@/data/style";
import { getChildById } from "@/services/childService";

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
  
export const fetcher = (url: string, id: number | undefined | null) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
}).then(res => res.json());


export const fetcher_2 = (url: string, receiverId: number | undefined | null, receiverType : any) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receiverId, receiverType }),
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
  let icon = `/avatars/${type}_${randomIndex}.png`;
  return icon;
}

export const assertInt = (input : any) : number => {
  return typeof input === "string"? parseInt(input, 10) : input;
}

export const assertPositive = (number : number) : number => {
  return number < 0 ? 0 : number;
}

export function getCurrencySymbol(currency : string) {
  switch (currency.toLowerCase()) {
      case 'usd':
      case 'dollar':
          return '$';
      case 'euro':
          return '€';
      case 'alg_dinar':
          return 'DA';
      case 'irq_dinar':
          return 'ID';
      case 'kwd':
      case 'kuwait_dinar':
          return 'KD';
      case 'gbp':
      case 'pound':
          return '£';
      case 'inr':
      case 'rupee':
          return '₹';
      case 'yen':
      case 'jpy':
          return '¥';
      case 'cad':
      case 'canadian_dollar':
          return 'CA$';
      case 'aud':
      case 'australian_dollar':
          return 'AU$';
      case 'cny':
      case 'yuan':
          return 'CN¥';
      case 'zar':
      case 'rand':
          return 'R';
      case 'chf':
      case 'swiss_franc':
          return 'CHF';
      case 'mxn':
      case 'peso':
          return 'MX$';
      case 'rub':
      case 'ruble':
          return '₽';
      case 'brl':
      case 'brazilian_real':
          return 'R$';
      case 'try':
      case 'turkish_lira':
          return '₺';
      case 'krw':
      case 'won':
          return '₩';
      case 'sek':
      case 'swedish_krona':
          return 'kr';
      case 'nok':
      case 'norwegian_krone':
          return 'kr';
      case 'dkk':
      case 'danish_krone':
          return 'kr';
      case 'sgd':
      case 'singapore_dollar':
          return 'S$';
      case 'myr':
      case 'malaysian_ringgit':
          return 'RM';
      case 'thb':
      case 'baht':
          return '฿';
      case 'hkd':
      case 'hong_kong_dollar':
          return 'HK$';
      case 'nz':
      case 'new_zealand_dollar':
          return 'NZ$';
      case 'php':
      case 'philippine_peso':
          return '₱';
      case 'zar':
      case 'south_african_rand':
          return 'R';
      case 'qar':
      case 'qatar_riyal':
          return 'QR';
      case 'sar':
      case 'saudi_riyal':
          return 'SR';
      case 'aed':
      case 'uae_dirham':
          return 'AED';
      case 'egp':
      case 'egyptian_pound':
          return 'E£';
      case 'vnd':
      case 'dong':
          return '₫';
      case 'bhd':
      case 'bahraini_dinar':
          return 'BD';
      default:
          return '';
  }
}
