import findMatchWords from "../../server/server";

export default async function getMatchWords(_word) {
  return await findMatchWords(_word);
}