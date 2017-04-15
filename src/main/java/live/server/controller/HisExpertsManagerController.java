package live.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import live.server.Util.CommonUtil;
import live.server.dao.AccountDao;
import live.server.model.Account;
import live.server.model.Expert;
import live.server.service.ExpertsService;

@Controller
@RequestMapping("/console/hisExpertsManager")
public class HisExpertsManagerController  {
	private static final Log logger = LogFactory.getLog(HisExpertsManagerController.class);
	
	@Autowired
	ExpertsService expertsService;
	
	@Autowired
	AccountDao accountDao;

	@ModelAttribute
	public void name(Model model) {
		model.addAttribute("page", "hisExpertsManager");
	}

	@RequestMapping(value = { "", "index" })
	public String index(Model model) {
		return "vm/hisExpertsManager";
	}

	@RequestMapping(value = "list")
	@ResponseBody
	public Map<String, Object> list(@RequestParam("draw") int draw, 
									@RequestParam("start") int offset,
									@RequestParam("length") int limit) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		int count = expertsService.countAllCurrentExperts(CommonUtil.HISTORY_EXPERT);
		
		List<Expert> hospitalList = expertsService.queryCurrentExpertsByOffset(CommonUtil.HISTORY_EXPERT, offset, limit);
		
		map.put("draw", draw);
		map.put("recordsTotal", count);
		map.put("recordsFiltered", count);
		map.put("data", hospitalList);
		return map;
	}
	
	@RequestMapping(value = "update_current")
	@ResponseBody
	public Map<String, Object> updateToCurrent(@RequestParam("ids[]") String[] ids) {
		Map<String, Object> map = new HashMap<String, Object>();
		expertsService.updateToCurrent(ids);
		return map;
	}
}
