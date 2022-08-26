export default async function getRestaurantData(pageIndex = 1) {
  const baseUrl = 'https://www.gimhae.go.kr/openapi/tour/restaurant.do?page=' + pageIndex;
  return await fetch(baseUrl, {
    mode: 'no-cors',
  }).then(res => res.json());
}