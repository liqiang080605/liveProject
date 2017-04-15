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
import live.server.model.Hospital;
import live.server.service.ExpertsService;

@Controller
@RequestMapping("/console/expertsManager")
public class ExpertsManagerController  {
	private static final Log logger = LogFactory.getLog(ExpertsManagerController.class);
	
	@Autowired
	ExpertsService expertsService;
	
	@Autowired
	AccountDao accountDao;

	@ModelAttribute
	public void name(Model model) {
		model.addAttribute("page", "expertsManager");
	}

	@RequestMapping(value = { "", "index" })
	public String index(Model model) {
		return "vm/expertsManager";
	}

	@RequestMapping(value = "list")
	@ResponseBody
	public Map<String, Object> list(@RequestParam("draw") int draw, 
									@RequestParam("start") int offset,
									@RequestParam("length") int limit) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		int count = expertsService.countAllCurrentExperts(CommonUtil.CURRENT_EXPERT);
		
		List<Expert> hospitalList = expertsService.queryCurrentExpertsByOffset(CommonUtil.CURRENT_EXPERT, offset, limit);
		
		map.put("draw", draw);
		map.put("recordsTotal", count);
		map.put("recordsFiltered", count);
		map.put("data", hospitalList);
		return map;
	}
	
	@RequestMapping(value = "create")
	@ResponseBody
	public Map<String, Object> create(@RequestParam("name") String name, 
									  @RequestParam("title") String title,
									  @RequestParam("level") String level,
									  @RequestParam("detail") String detail) {
		Map<String, Object> map = new HashMap<String, Object>();
		Account a = accountDao.queryById(name);
		
		if(a != null) {
			map.put("code", 500);
			map.put("message", "用户名已存在");
			return map;
		}
		
		try {
			expertsService.addExperts(name, title, level, detail);
		} catch (Exception e) {
			logger.error("Add experts failed.", e);
			map.put("message", e.getMessage());
		}
		
		return map;
	}
	
	
	@RequestMapping(value = "update_history")
	@ResponseBody
	public Map<String, Object> updateToHistory(@RequestParam("ids[]") String[] ids) {
		Map<String, Object> map = new HashMap<String, Object>();
		expertsService.updateToHistory(ids);
		return map;
	}
}
