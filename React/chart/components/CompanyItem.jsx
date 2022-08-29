import styled from "styled-components";

const CompanyItemTemplate = styled.li`
  margin: 0 5px;
`;

const CompanyItemContent = styled.button`
  all: unset;
  border-radius: 50px;
  padding: 5px 15px;
  transition: 0.3s;
  background-color: ${({isSelect}) => (
    isSelect ? 'rgba(3, 136, 252, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  )};
  color: ${({isSelect}) => (
    isSelect ? 'rgba(3, 136, 252)' : 'rgba(0, 0, 0)'
  )};
`;

export default function CompanyItem({ company, isSelect, onClick }) {
  return (
    <CompanyItemTemplate onClick={onClick}>
      <CompanyItemContent isSelect={isSelect}>{ company }</CompanyItemContent>
    </CompanyItemTemplate>
  )
}