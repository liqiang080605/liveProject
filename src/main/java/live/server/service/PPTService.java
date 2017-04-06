package live.server.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.Constants;
import live.server.Util.JsonUtil;
import live.server.dao.PPTDao;
import live.server.model.Account;
import live.server.model.PPTInfo;
import live.server.model.UserRole;

@Service
public class PPTService {
	
	private static final Log log = LogFactory.getLog(PPTService.class);
	
	@Autowired
	AccountService aService;
	
	@Autowired
	PPTDao pptDao;

	public void exec(String cmd, String jsonStr, Map<String, Object> resultMap) {
		if(cmd.equals("upload")) {
			upload(jsonStr, resultMap);
		} else if (cmd.equals("delete")) {
			delete(jsonStr, resultMap);
		} else if (cmd.equals("list")) {
			list(jsonStr, resultMap);
		} else {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Cmd is error.");
			return;
		}
	}

	private void list(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token") || !map.containsKey("index") || !map.containsKey("size")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		String token = String.valueOf(map.get("token"));
		int index = Integer.valueOf(String.valueOf(map.get("index")));
		int size = Integer.valueOf(String.valueOf(map.get("size")));
		
		Account account = aService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!aService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		int count = pptDao.count();
		
		PPTInfo queryInfo = new PPTInfo();
		queryInfo.setOffset(index);
		queryInfo.setLimit(size);
		
		List<PPTInfo> pptList = pptDao.query(queryInfo);
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("total", count);
		
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		
		for(PPTInfo info : pptList) {
			Map<String, Object> pptMap = new HashMap<String, Object>();
			
			pptMap.put("name", info.getName());
			pptMap.put("uuid", info.getUuid());
			pptMap.put("customer_url", info.getCustomer_url());
			
			if(account.getRole() > UserRole.USER.getRole()) {
				pptMap.put("server_url", info.getServer_url());
			}
			
			list.add(pptMap);
		}
		dataMap.put("pptlist", list);
		
		resultMap.put("data", dataMap);
		resultMap.put("errorCode", Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success.");
	}

	private void delete(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token") || !map.containsKey("uuid")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		String token = String.valueOf(map.get("token"));
		String uuid = String.valueOf(map.get("uuid"));
		
		Account account = aService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!aService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		if(account.getRole() < UserRole.ADMIN.getRole()) {
			resultMap.put("errorCode",Constants.ERR_PPT_NOPOWER);
			resultMap.put("errorInfo", "User has no power to upload ppt.");
			return;
		}
		
		pptDao.deleteByUUID(uuid);
		resultMap.put("errorCode", Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success.");
	}

	private void upload(String jsonStr, Map<String, Object> resultMap) {

		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token") || !map.containsKey("uuid") || !map.containsKey("name")
				|| !map.containsKey("server_url") || !map.containsKey("customer_url")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		String token = String.valueOf(map.get("token"));
		String name = String.valueOf(map.get("name"));
		String uuid = String.valueOf(map.get("uuid"));
		String server_url = String.valueOf(map.get("server_url"));
		String customer_url = String.valueOf(map.get("customer_url"));
		
		Account account = aService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!aService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		if(account.getRole() < UserRole.ADMIN.getRole()) {
			resultMap.put("errorCode",Constants.ERR_PPT_NOPOWER);
			resultMap.put("errorInfo", "User has no power to upload ppt.");
			return;
		}
		
		PPTInfo queryInfo = new PPTInfo();
		queryInfo.setName(name);
		queryInfo.setUuid(uuid);
		
		List<PPTInfo> pptList = pptDao.query(queryInfo);
		if(pptList.size() > 0) {
			log.error("The ppt has exist. name is " + name + ". uuid is " + uuid);
			resultMap.put("errorCode", Constants.ERR_PPT_EXIST);
			resultMap.put("errorInfo", "The ppt has exist.");
			return;
		}
		
		queryInfo.setUid(account.getUid());
		queryInfo.setUuid(uuid);
		queryInfo.setServer_url(server_url);
		queryInfo.setCustomer_url(customer_url);
		queryInfo.setCreate_time(String.valueOf(System.currentTimeMillis()/1000));
		
		int count = pptDao.insert(queryInfo);
		
		if(count < 1) {
			log.error("Failed to upload ppt. name is " + name + ". uuid is " + uuid);
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server err.");
			return;
		}
		
		resultMap.put("errorCode", Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success.");
	}

}
