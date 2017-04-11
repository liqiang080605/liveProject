package live.server.interceptor;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import live.server.model.Account;

public class LoginContextInterceptor extends HandlerInterceptorAdapter {

	private static Log log = LogFactory.getLog(LoginContextInterceptor.class);

	public final boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws ServletException, IOException {
		
		// 首次登陆
		if(!request.getRequestURI().contains("console") || request.getRequestURI().contains("/console/login/")) {
			return true;
		}
		
		Object username = request.getSession().getAttribute("username");
		
		if(username == null) {
			response.sendRedirect("/");
		}
		
		return true;

	}

	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		//TODO
	}

	private Account getUserFromCookie(HttpServletRequest request) {
		Account account = null;

		return account;

	}

}
