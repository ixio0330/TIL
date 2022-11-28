select e.*, d.dname 
from hr.emp e
	join hr.dept d on e.deptno = d.deptno 
	
-- join 실습 1
	
-- job이 salesman인 직원정보와 직원이 속한 부서명을 가져오기
select e.*, d.dname 
from hr.emp e 
	join hr.dept d on e.deptno = d.deptno 
where e.job='SALESMAN'

-- 부서명 SLAES와 RESEARCH의 소속 직원들의 부서명, 직원번호, 직원명, JOB, 과거 급여 정보 추출
-- 나
select *
from hr.emp e 
	join hr.dept d on e.deptno = d.deptno 
	join hr.emp_salary_hist esh on e.empno = esh.empno 
where d.dname in ('SALES', 'RESEARCH')
order by d.dname 

-- 강사
select d.dname, e.empno , e.ename , e.job , esh.fromdate , esh.todate , esh.sal 
from hr.dept d 
	join hr.emp e on d.deptno = e.deptno 
	join hr.emp_salary_hist esh on e.empno = esh.empno 
where d.dname in ('SALES', 'RESEARCH')

-- 부서명 SALES와 RESEARCHdml 소속 직원들의 부서명, 직원번호, 직원명, JOB, 과거 급여 정보중 1983년 이전 데이터는 무시하고 데이터 추출
select d.dname, e.empno , e.ename , e.job , esh.fromdate , esh.todate , esh.sal 
from hr.dept d 
	join hr.emp e on d.deptno = e.deptno 
	join hr.emp_salary_hist esh on e.empno = esh.empno 
where d.dname in ('SALES', 'RESEARCH')
and esh.fromdate  >= to_date('19830101', 'yyyymmdd') 
order by d.dname 

-- 부서명 SALES와 RESEARCH 소속 직원별로 과거부터 현재까지 모든 급여를 취합한 평균 급여
with 
temp_01 as 
(
select d.dname, e.empno , e.ename , e.job , esh.fromdate , esh.todate , esh.sal 
from hr.dept d 
	join hr.emp e on d.deptno = e.deptno 
	join hr.emp_salary_hist esh on e.empno = esh.empno 
where d.dname in ('SALES', 'RESEARCH')
and esh.fromdate  >= to_date('19830101', 'yyyymmdd') 
order by d.dname, e.empno, esh.fromdate 
)
select empno, max(ename) as ename, avg(sal) as avg_sal
from temp_01
group by empno;

-- 직원명 SMITH의 과거 소속 부서 정보 구하기
select a.ename, a.empno , b.deptno , c.dname , b.fromdate , b.todate 
from hr.emp a
	join hr.emp_dept_hist b on a.empno = b.empno 
	join hr.dept c on b.deptno = c.deptno 
where a.ename = 'SMITH'

-- join 실습 2

-- 고객명 Antonio Moreno이 1997년에 주무한 주문 정보를 주문 아이디, 주문일자, 배송일자, 배송 주소를 고객 주소와 함께 구하기
select a.contact_name , b.order_id , b.order_date , b.shipped_date , a.address 
from nw.customers a
	join nw.orders b on a.customer_id = b.customer_id 
where a.contact_name = 'Antonio Moreno'
and b.order_date between to_date('19970101', 'yyyymmdd') and to_date('19971231', 'yyyymmdd')

-- Barlin에 살고 있는 고객이 주문한 주문 정보 고객명, 주문id, 주문일자, 주문접수 직원명, 배송업체명
select a.contact_name , b.order_id , b.order_date , c.first_name||' '||c.last_name as employee_name , d.company_name 
from nw.customers a
	join nw.orders b on a.customer_id = b.customer_id 
	join nw.employees c on b.employee_id = c.employee_id 
	join nw.shippers d on b.ship_via = d.shipper_id 
where a.city = 'Berlin'

-- Beverages 카테고리에 속하는 모든 상품아이디와 상품명, 상품을 제공하는 supplier 회사명 정보 구하기
select b.category_name , a.product_name , c.company_name 
from nw.products a
	join nw.categories b on a.category_id = b.category_id 
	join nw.suppliers c on a.supplier_id = c.supplier_id 
where b.category_name = 'Beverages'

-- 고객명 Antonio Moreno이 1997년에 주무한 주문 상품정보를 고객 주소, 주문 아이디, 주문일자, 배송일자, 배송 주소 및 주문 상품아이디, 주문 상품명, 주문 상품별 금액, 주문 상품이 속한 카테고리명, supplier명 구하기
select a.customer_id , b.order_id ,  d.product_id , b.order_date , b.shipped_date , b.ship_address ,d.product_name , c.amount , e.category_id , f.contact_name 
from nw.customers a
	join nw.orders b on a.customer_id = b.customer_id 
	join nw.order_items c on c.order_id = b.order_id 
	join nw.products d on d.product_id = c.product_id 
	join nw.categories e on d.category_id = e.category_id 
	join nw.suppliers f on d.supplier_id = f.supplier_id 
where a.contact_name = 'Antonio Moreno'
and b.order_date between to_date('19970101', 'yyyymmdd') and to_date('19971231', 'yyyymmdd')

-- outer 실습 1

-- 주문이 단 한번도 없는 고객 정보 구하기
select a.customer_id , a.contact_name 
from nw.customers a
	left outer join nw.orders b on a.customer_id = b.customer_id 
where b.order_id  is null

-- 부서정보와 부서에 소속된 직원명 정보 구하기, 부서가 직원을 가지고 있지 않더라도 부서정보는 표시되어야 함
select a.*, b.empno , b.ename 
from hr.dept a
	left join hr.emp b on a.deptno = b.deptno 
order by a.deptno 

select b.*, a.empno , a.ename 
from hr.emp a
	right join hr.dept b on a.deptno = b.deptno 
	
-- Madrid에 살고 있는 고객이 주문한 주문 정보 구하기
	-- 고객명, 주문id, 주문일자, 주문접수 직원명, 배송업체명 구하되
	-- 만일 고객이 주문을 한번도 하지 않은 경우라도 고객정보는 빠지면 안됨
	-- 이 경우 주문정보가 없으면 주문id를 0으로 나머지는 NULL로 구할 것
select a.contact_name , a.customer_id , coalesce(b.order_id, 0) , b.order_date, 
		c.first_name||' '||c.last_name as employee_name , b.ship_name,
		d.company_name as shipper_name
from nw.customers a
	left join nw.orders b on a.customer_id = b.customer_id 
	left join nw.employees c on b.employee_id = c.employee_id 
	left join nw.shippers d on b.ship_via = d.shipper_id 
where a.city = 'Madrid'

-- orders_items에 주분번호(order_id)가 없는 order_id를 가진 orders
select *
from nw.orders a
	left join nw.order_items b on a.order_id = b.order_id 
where b.order_id is null

-- orders 테이블에 있는 order_id가 없는 order_items 데이터 찾기
select *
from nw.order_items a
	left join nw.orders b on a.order_id = b.order_id 
where a.order_id is null
