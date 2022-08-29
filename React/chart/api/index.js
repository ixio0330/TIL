import Database from './data.json';

export function getCategoryList(lang = 'ko') {
  return Database.category[lang];
}

export function getCompanyList(lang = 'ko') {
  const companyList = [];
  Database.list.forEach((company) => {
    companyList.push({
      name: company.name,
      viewName: company.viewName[lang]
    });
  });
  return companyList;
}

export function getCompanyData(companyName) {
  const companyData = Database.list.find((company) => company.name === companyName);
  if (!companyData) {
    throw new Error(`Undefined company: ${companyName}`);
  }
  return companyData;
}