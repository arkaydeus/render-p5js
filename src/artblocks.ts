import axios from "axios";
import alltokens from "./alltokens.json";

export const getArblocksAssets = async (tokenId: string | number) => {
  const url = `https://token.artblocks.io/${tokenId}`;

  const response = await axios.get(url);

  return response.data;
};

export const getTokenHash = (tokenId: string | number): string | null => {
  const hash = alltokens.hashes[tokenId.toString()];
  return hash || null;
};
