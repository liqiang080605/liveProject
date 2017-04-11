package live.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import live.server.model.Code;
import live.server.service.CodeService;

@Controller
@RequestMapping("/console/code")
public class CodeManagerController  {
	private static final Log logger = LogFactory.getLog(CodeManagerController.class);
	
	@Autowired
	CodeService codeService;

	@ModelAttribute
	public void name(Model model) {
		model.addAttribute("page", "code");
	}

	@RequestMapping(value = { "", "index" })
	public String index(Model model) {
		return "vm/code";
	}

	@RequestMapping(value = "list")
	@ResponseBody
	public Map<String, Object> list(@RequestParam("draw") int draw, 
									@RequestParam("start") int offset,
									@RequestParam("length") int limit) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		int count = codeService.countAllCodes();
		
		List<Code> codeList = codeService.queryAllCodeByOffset(offset, limit);
		
		map.put("draw", draw);
		map.put("recordsTotal", count);
		map.put("recordsFiltered", count);
		map.put("data", codeList);
		return map;
	}
	
	@RequestMapping(value = "create")
	@ResponseBody
	public Map<String, Object> create(HttpServletRequest request) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		codeService.create(String.valueOf(request.getSession().getAttribute("username")), map);
		
		return map;
	}
}
