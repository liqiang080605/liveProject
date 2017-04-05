package live.server.controller;

import java.util.HashMap;
import java.util.Map;

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
@RequestMapping("/login")
public class LoginController {
	@Autowired
	AccountService accountService;

    Logger logger = Logger.getLogger(LoginController.class);

    @RequestMapping(value = "in", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestParam(value = "username", required = true) String username,
			@RequestParam(value = "password", required = true) String password) throws Exception {
    	
    	Map<String, Object> resultMap = new HashMap<String, Object>();
    	
    	accountService.login(username, password, resultMap);
    	
    	int code = Integer.valueOf(String.valueOf(resultMap.get("errorCode")));
    	
    	resultMap.clear();
    	if(code != 0) {
    		resultMap.put("success", false);
    		resultMap.put("data", "用户名或密码不正确");
    	} else {
    		resultMap.put("success", true);
    	}
    	return JsonUtil.mapToJson(resultMap);
    }

    @RequestMapping(value = "error", method = RequestMethod.POST)
    public String logout(Model model) {
        return "vm/index/sys_error";
    }

}
