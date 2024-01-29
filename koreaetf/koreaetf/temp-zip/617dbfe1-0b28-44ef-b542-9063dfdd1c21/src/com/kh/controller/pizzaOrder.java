package com.kh.controller;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class pizzaOrder
 */
@WebServlet("/pizzaOrder.do")
public class pizzaOrder extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public pizzaOrder() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String userName = request.getParameter("userName");
		String phone = request.getParameter("phone");
		String address = request.getParameter("address");
		String content = request.getParameter("content");
		String pizza = request.getParameter("pizza");
		String[] topping = request.getParameterValues("topping");
		String[] side = request.getParameterValues("side");
		String payment = request.getParameter("payment");
		
		
		
		System.out.println("주문자명 :"+userName);
		System.out.println("전화번호 :"+phone);
		System.out.println("주소 :"+address);
		System.out.println("요청사항 :"+content);
		System.out.println("주문하신 피자 : " + pizza);
		System.out.println("추가 토핑 종류 :"+ topping);
		System.out.println("사이드 :"+ side);
		System.out.println("결제방식 :"+payment);
		
		request.setAttribute("userName", userName);
		request.setAttribute("userName", phone);
		request.setAttribute("userName", userName);
		request.setAttribute("userName", userName);
		request.setAttribute("userName", userName);
		request.setAttribute("userName", userName);
		request.setAttribute("userName", userName);
		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		request.setCharacterEncoding("UTF-8");
		String userName = request.getParameter("userName");
		String phone = request.getParameter("phone");
		String address = request.getParameter("address");
		String content = request.getParameter("content");
		String pizza = request.getParameter("pizza");
		String[] topping = request.getParameterValues("topping");
		String[] side = request.getParameterValues("side");
		String payment = request.getParameter("payment");
		
		int price = 0;
		
		switch(pizza) {
		case "콤피네이션 피자" : price = 10000; break;
		case "치즈 피자" : price = 8000; break;
		case "페퍼로니 피자" : price = 9000; break;
		case "고구마 피자" : price = 9500; break;
		case "치즈크러스트 피자" : price = 12000; break;
		}
		
		if(topping != null) {
			for(int i = 0; i < topping.length; i++) {				
				switch(topping[i]) {
				case "베이컨":
					price += 2000;
					break;
				case "고구마무스":
					price += 1500;
					break;
				case "눈꽃치즈":
					price += 2500;
					break;
				case "블랙타이거새우":
					price += 6000;
					break;
				case "올리브":
					price += 1000;
					break;
				case "이베리코":
					price += 5000;
					break;
				}
			}
		}
		
		if(side != null) {
			for(int i = 0; i < side.length; i++) {
				switch(side[i]) {
				case "콜라":
					price += 1500;
					break;
				case "스파게티":
					price += 5000;
					break;
				case "윙봉":
					price += 4000;
					break;
				case "갈릭소스":
					price += 500;
					break;
				case "치즈볼":
					price += 2500;
					break;
				}
			}
		}
//		doGet(request, response);
		
		
		
		request.setAttribute("userName", userName);
		request.setAttribute("phone", phone);
		request.setAttribute("address", address);
		request.setAttribute("content", content);
		request.setAttribute("pizza", pizza);
		request.setAttribute("topping", topping);
		request.setAttribute("side", side);
		request.setAttribute("payment", payment);
		request.setAttribute("price", price);
		
		RequestDispatcher rd = request.getRequestDispatcher("views/05_pizzaPayment.jsp");
		
		rd.forward(request, response);
	}

}
