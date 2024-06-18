import { atom } from "jotai";
function generateRandomCapitalLetter(): string {
  // Random number between 0 and 25 representing uppercase letters (A-Z)
  const randomIndex = Math.floor(Math.random() * 26);

  // Convert index to ASCII code for uppercase letters (A-Z)
  const charCode = randomIndex + 65;

  return String.fromCharCode(charCode); // Convert ASCII code to single character
}

export const tickets = atom<any>(null)
export const currentQuotation = atom<any>(null)
export const adminSeeAgents = atom<boolean>(false)
export const userToShowMessages = atom<any>(null)
export const ticketsToView = atom<any>(null)
export const selectedTicket = atom<any>(null)
export const products = atom<any>([]);
export const productToShow= atom<any>(null);
export const searchedText = atom<any>(generateRandomCapitalLetter());
export const imageUrl = atom<any>(null);
export const userToEdit = atom<any>(null);
export const pageNumber = atom<number>(1);
export const filtersData = atom<any>({gender : null, category : null, size : null, minPrice : 0, maxPrice : 10000});
export const wishlist = atom<any>([]);
export const loadingProducts = atom<boolean>(true)
export const loadingTickets = atom<boolean>(true)
export const ticketsSorting = atom<string>('Newest');
