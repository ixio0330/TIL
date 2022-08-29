import { useState } from "react";
import { getCategoryList, getCompanyData, getCompanyList } from "../api";
import BarChart from "../components/BarChart";
import CompanyList from "../components/CompanyList";
import SelectLang from "../components/SelectLang";

const getRandomNumber = () => {
  return Math.floor(Math.random() * 100) + 1;
}

const getRandomData = () => {
  return [getRandomNumber(), getRandomNumber(), getRandomNumber(), getRandomNumber()]
}

const getChartData = (propensity) => {
  const result = [];
  for (const key in propensity) {
    result.push(propensity[key]);
  }
  return result;
}

export default function AnalysisView() {
  const [selectCompany, setSelectCompany] = useState('Company1');
  const [lang, setLang] = useState('ko');

  const updateLang = {
    ko: () => {
      setLang('ko');
    },
    en: () => {
      setLang('en');
    }
  }

  const updateSelectCompany = (compnay) => {
    setSelectCompany(compnay);
  };

  const chartData = {
    labels: getCategoryList(lang),
    datasets: [
      {
        label: getCompanyData(selectCompany).viewName[lang],
        data: getChartData(getCompanyData(selectCompany).propensity),
        backgroundColor: '#a496ff',
      },
      {
        label: lang === 'ko' ? '사용자' : 'User',
        data: getRandomData(),
        backgroundColor: '#96ffa6',
      }
    ],
    styles: {
      width: '600px',
    }
  };

  return (
    <>
      <SelectLang updateLang={updateLang} />
      <CompanyList companyList={getCompanyList(lang)} selectCompany={selectCompany} onClick={updateSelectCompany} />
      <BarChart {...chartData} />
    </>
  )
}