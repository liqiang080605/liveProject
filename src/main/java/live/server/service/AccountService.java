package live.server.service;

import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;
import live.server.Util.Constants;
import live.server.Util.JsonUtil;
import live.server.dao.AccountDao;
import live.server.model.Account;

@Service
public class AccountService {
	private static final Log log = LogFactory.getLog(AccountService.class);
	
	@Autowired
	AccountDao accountDao;
	
	public void exec(String cmd, String jsonStr, Map<String, Object> resultMap) {
		if(cmd.equals("regist")) {
			register(jsonStr, resultMap);
		}
	}

	private void register(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("id") || !map.containsKey("pwd")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		
		String id = String.valueOf(map.get("id"));
		String pwd = String.valueOf(map.get("pwd"));
		pwd = CommonUtil.md5(pwd);
		
		Account account = accountDao.queryById(id);
		
		if(account != null) {
			resultMap.put("errorCode",Constants.ERR_REGISTER_USER_EXIST);
			resultMap.put("errorInfo", "Register user id existed.");
			return;
		}
		
		account = new Account();
		account.setUid(id);
		account.setPwd(pwd);
		account.setLast_request_time("0");
		account.setLogin_time("0");
		account.setLogout_time("0");
		account.setRegister_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setState("0");
		
		int count = accountDao.insert(account);
		
		if(count < 1) {
			resultMap.put("errorCode",Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server inner error, Regist fail!");
		} else {
			resultMap.put("errorCode", Constants.ERR_SUCCESS);
			resultMap.put("errorInfo", "success");
		}
	}

}
