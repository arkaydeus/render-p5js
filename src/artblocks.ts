import axios from "axios";

export const getArblocksAssets = async (tokenId: string | number) => {
  const url = `https://token.artblocks.io/${tokenId}`;

  const response = await axios.get(url);

  return response.data;
};

export const getTokenHash = async (tokenId: string | number) => {
  const data = await getArblocksAssets(tokenId);
  return data.token_hash;
};
