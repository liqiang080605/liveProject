package live.server.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import live.server.Util.JsonUtil;
import live.server.service.AccountService;


@Controller
@RequestMapping("/console/login")
public class LoginController {
	@Autowired
	AccountService accountService;

    Logger logger = Logger.getLogger(LoginController.class);

    @RequestMapping(value = "in", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestParam(value = "username", required = true) String username,
    		@RequestParam(value = "password", required = true) String password,
    		HttpServletRequest request, HttpServletResponse response) throws Exception {
    	logger.info("Manager console login info user is " + username);
    	
    	Map<String, Object> resultMap = new HashMap<String, Object>();
    	
    	accountService.login(username, password, resultMap);
    	
    	if(!Boolean.valueOf(String.valueOf(resultMap.get("success")))) {
    		resultMap.put("success", false);
    		resultMap.put("data", "用户名或密码不正确");
    	} else {
    		resultMap.put("success", true);
    		
    		request.getSession().setAttribute("username", username);
    	}
    	return JsonUtil.mapToJson(resultMap);
    }

    @RequestMapping(value = "out")
    @ResponseBody
    public String logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
    	Map<String, Object> resultMap = new HashMap<String, Object>();
    	
    	request.getSession().removeAttribute("username");
    	response.sendRedirect("/");
    	return JsonUtil.mapToJson(resultMap);
    }
}
