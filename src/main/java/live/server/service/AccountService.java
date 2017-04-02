package live.server.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;
import live.server.Util.Constants;
import live.server.Util.JsonUtil;
import live.server.dao.AccountDao;
import live.server.model.Account;
import live.server.model.UserRole;
import live.server.shell.ShellService;

@Service
public class AccountService {
	private static final Log log = LogFactory.getLog(AccountService.class);
	
	@Autowired
	AccountDao accountDao;
	
	@Autowired
	ShellService shellService;
	
	public void exec(String cmd, String jsonStr, Map<String, Object> resultMap) {
		if(cmd.equals("regist")) {
			register(jsonStr, resultMap);
		} else if(cmd.equals("login")) {
			login(jsonStr, resultMap);
		}  else if(cmd.equals("logout")) {
			logout(jsonStr, resultMap);
		}else {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Cmd is error.");
			return;
		}
	}

	private void logout(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		
		//参数验证
		if(!map.containsKey("token")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		
		String token = String.valueOf(map.get("token"));
		
		Account account = queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		logout(account);
		
		resultMap.put("errorCode", Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success!");
		return;
	}

	private void login(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		
		//参数验证
		if(!map.containsKey("id") || !map.containsKey("pwd")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		
		String id = String.valueOf(map.get("id"));
		String pwd = String.valueOf(map.get("pwd"));
		pwd = CommonUtil.sha256(pwd);
		
		Account account = accountDao.queryById(id);
		
		//账号验证
		if(account == null) {
			resultMap.put("errorCode",Constants.ERR_USER_NOT_EXIST);
			resultMap.put("errorInfo", "User not exist.");
			return;
		}
		
		//密码验证
		if(!pwd.equals(account.getPwd())) {
			resultMap.put("errorCode",Constants.ERR_PASSWORD);
			resultMap.put("errorInfo", "User password error.");
			return;
		}
		
		if(account.getCode_status() == 0) {
			resultMap.put("errorCode", Constants.ERR_CODE_CHECK);
			resultMap.put("errorInfo", "Please check the code");
			return;
		}
		
		//获取sig
		String user_sig = account.getUser_sig();
		if(StringUtils.isBlank(user_sig)) {
			user_sig = shellService.createUserSig(CommonUtil.SDK_APPID, account.getUid());
			if(StringUtils.isBlank(user_sig)) {
				resultMap.put("errorCode",Constants.ERR_SERVER);
				resultMap.put("errorInfo", "Server error: gen sig fail.");
				return;
			}
			
			account.setUser_sig(user_sig);
		}
		
		//是否已经登陆
		if(account.getState().equals("1")) {
			resultMap.put("errorCode", Constants.ERR_SUCCESS);
			resultMap.put("errorInfo", "success");
			Map<String, Object> dataMap = new HashMap<String, Object>();
			dataMap.put("token", account.getToken());
			dataMap.put("userSig", account.getUser_sig());
			dataMap.put("codeStatus", account.getCode_status());
			resultMap.put("data", dataMap);
			return;
		}
		
		String token = CommonUtil.md5(account.getUid() + System.currentTimeMillis()/1000);
		if(StringUtils.isBlank(token)) {
			resultMap.put("errorCode",Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server error");
			return;
		}
		
		account.setToken(token);
		account.setState(1);
		account.setLogin_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setLast_request_time(String.valueOf(System.currentTimeMillis()/1000));
		
		int count = accountDao.update(account);
		
		if(count < 1) {
			resultMap.put("errorCode",Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server inner error, update account failed!");
		} else {
			resultMap.put("errorCode", Constants.ERR_SUCCESS);
			resultMap.put("errorInfo", "success");
			Map<String, Object> dataMap = new HashMap<String, Object>();
			dataMap.put("token", account.getToken());
			dataMap.put("userSig", account.getUser_sig());
			resultMap.put("data", dataMap);
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
		pwd = CommonUtil.sha256(pwd);
		
		Account account = accountDao.queryById(id);
		
		if(account != null) {
			resultMap.put("errorCode",Constants.ERR_REGISTER_USER_EXIST);
			resultMap.put("errorInfo", "Register user id existed.");
			return;
		}
		
		account = new Account();
		account.setUid(id);
		account.setPwd(pwd);
		account.setLast_request_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setLogin_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setLogout_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setRegister_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setState(0);
		account.setRole(UserRole.USER.getRole());
		account.setCode_status(0);
		
		int count = accountDao.insert(account);
		
		if(count < 1) {
			resultMap.put("errorCode",Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server inner error, Regist fail!");
		} else {
			resultMap.put("errorCode", Constants.ERR_SUCCESS);
			resultMap.put("errorInfo", "success");
		}
	}

	public Account queryByToken(String token) {
		return accountDao.queryByToken(token);
	}

	public boolean checkToken(String token) {
		Account account = queryByToken(token);
		long last_request_time = Long.valueOf(account.getLast_request_time());
		long currentTime = System.currentTimeMillis()/1000;
		if(currentTime - last_request_time > CommonUtil.EXPIRED_TIME) {
			int count = logout(account);
			if(count < 1) {
				log.error("Repeat logout. account uid is " + account.getUid());
			}
			return false;
		}
		
		account.setLast_request_time(String.valueOf(currentTime));
		accountDao.update(account);
		
		return true;
	}

	private int logout(Account account) {
		account.setState(CommonUtil.ACCOUNT_STATE_0);
		account.setLogout_time(String.valueOf(System.currentTimeMillis()/1000));
		return accountDao.logout(account);
	}

	public void update(Account account) {
		accountDao.update(account);
	}
	
}
