package live.server.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import live.server.service.CodeService;
import live.server.service.ImageService;
import live.server.service.LiveService;
import live.server.service.PPTService;

@Controller
public class RestController {
	private static final Log log = LogFactory.getLog(RestController.class);
	
	@Autowired
	AccountService accountService;
	
	@Autowired
	LiveService liveService;
	
	@Autowired
	CodeService codeService;
	
	@Autowired
	PPTService pptService;
	
	@Autowired
	ImageService imageService;
	
	@RequestMapping(value = "index.php", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String add(@RequestParam(value = "svc", required = true) String svc,
			@RequestParam(value = "cmd", required = true) String cmd,
			@RequestBody String jsonStr, HttpServletResponse response, HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		log.info("Request svc is " + svc + ". cmd is " + cmd + ". body is " + jsonStr);
		
		try {
			if(svc.equals("account")) {
				accountService.exec(cmd, jsonStr, resultMap);
			} else if (svc.equals("live")) {
				liveService.exec(cmd, jsonStr, resultMap);
			} else if (svc.equals("code")) {
				codeService.exec(cmd, jsonStr, resultMap);
			} else if (svc.equals("ppt")) {
				pptService.exec(cmd, jsonStr, resultMap);
			}
		} catch (Exception e) {
			log.error("Failed to exec cmd. " + "Request svc is " + 
					svc + ". cmd is " + cmd + ". body is " + jsonStr, e);
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", e.getMessage());
		}
		
		return JsonUtil.mapToJson(resultMap);
	}
	
	@RequestMapping(value = "/image/download", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String download(HttpServletResponse response, HttpServletRequest request) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		log.info("Request url is /image/download");
		
		try {
			imageService.download(response, request, resultMap);
		} catch (Exception e) {
			log.error("Failed to exec cmd. Request url is /image/download", e);
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
