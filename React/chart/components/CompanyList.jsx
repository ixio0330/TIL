import styled from "styled-components";
import CompanyItem from "./CompanyItem";

const CompanyTemplate = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: felx;
  width: 400px;
  overflow: hidden;
`;

export default function CompanyList({ companyList, selectCompany, onClick }) {
  return (
    <CompanyTemplate>
      {
        companyList.map(
          (company) => 
            (
              <CompanyItem 
                key={company.name} 
                company={company.viewName}
                is={selectCompany === company.name} 
                onClick={() => onClick(company.name)} 
              />
            )
        )
      }
    </CompanyTemplate>
  )
}