package live.server.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import live.server.Util.Constants;
import live.server.Util.JsonUtil;
import live.server.service.AccountService;
import live.server.service.LiveService;

@Controller
public class RestController {
	private static final Log log = LogFactory.getLog(RestController.class);
	
	@Autowired
	AccountService accountService;
	
	@Autowired
	LiveService liveService;
	
	@RequestMapping(value = "index.php", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String add(@RequestParam(value = "svc", required = true) String svc,
			@RequestParam(value = "cmd", required = true) String cmd,
			@RequestBody String jsonStr) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		log.info("Request svc is " + svc + ". cmd is " + cmd + ". body is " + jsonStr);
		
		try {
			if(svc.equals("account")) {
				accountService.exec(cmd, jsonStr, resultMap);
			} else if (svc.equals("live")) {
				liveService.exec(cmd, jsonStr, resultMap);
			}
		} catch (Exception e) {
			log.error("Failed to exec cmd. " + "Request svc is " + 
					svc + ". cmd is " + cmd + ". body is " + jsonStr, e);
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", e.getMessage());
		}
		
		return JsonUtil.mapToJson(resultMap);
	}
	
	@RequestMapping("test")
	@ResponseBody
	public String test() {
		return "test";
	}
	
}
