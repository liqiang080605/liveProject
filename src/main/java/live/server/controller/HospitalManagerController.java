package live.server.controller;

import java.util.Arrays;
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

import live.server.model.Hospital;
import live.server.service.HospitalService;

@Controller
@RequestMapping("/console/hospitalManager")
public class HospitalManagerController  {
	private static final Log logger = LogFactory.getLog(HospitalManagerController.class);
	
	@Autowired
	HospitalService hospitalService;

	@ModelAttribute
	public void name(Model model) {
		model.addAttribute("page", "hospitalManager");
	}

	@RequestMapping(value = { "", "index" })
	public String index(Model model) {
		return "vm/hospitalManager";
	}

	@RequestMapping(value = "list")
	@ResponseBody
	public Map<String, Object> list(@RequestParam("draw") int draw, 
									@RequestParam("start") int offset,
									@RequestParam("length") int limit) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		int count = hospitalService.countAllHospitals();
		
		List<Hospital> hospitalList = hospitalService.queryAllHospitalsByOffset(offset, limit);
		
		map.put("draw", draw);
		map.put("recordsTotal", count);
		map.put("recordsFiltered", count);
		map.put("data", hospitalList);
		return map;
	}
	
	@RequestMapping(value = "create")
	@ResponseBody
	public Map<String, Object> create(@RequestParam("name") String name, 
									  @RequestParam("province") String province,
									  @RequestParam("city") String city,
									  @RequestParam("county") String county,
									  @RequestParam("address") String address) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		Hospital h = new Hospital();
		h.setAddress(address);
		h.setCity(city);
		h.setCounty(county);
		h.setName(name);
		h.setProvince(province);
		
		try {
			hospitalService.addHospital(h);
		} catch (Exception e) {
			logger.error("Add hospital failed. info is " + h, e);
		}
		
		return map;
	}
	
	@RequestMapping(value = "update")
	@ResponseBody
	public Map<String, Object> update(@RequestParam("id") int id,
									  @RequestParam("name") String name, 
									  @RequestParam("province") String province,
									  @RequestParam("city") String city,
									  @RequestParam("county") String county,
									  @RequestParam("address") String address) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		Hospital h = new Hospital();
		h.setId(id);
		h.setAddress(address);
		h.setCity(city);
		h.setCounty(county);
		h.setName(name);
		h.setProvince(province);
		
		hospitalService.modifyHospital(h);
		
		return map;
	}
	
	@RequestMapping(value = "delete")
	@ResponseBody
	public Map<String, Object> delete(@RequestParam("ids[]") String[] ids) {
		Map<String, Object> map = new HashMap<String, Object>();
		String delMsg = hospitalService.deleteGroup(ids);
		map.put("message", delMsg);
		return map;
	}
}
