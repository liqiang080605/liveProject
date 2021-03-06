package live.server.service;

import java.util.HashMap;
import java.util.List;
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
import live.server.dao.CodeDao;
import live.server.model.Account;
import live.server.model.Code;
import live.server.model.UserRole;
import live.server.shell.ShellService;

@Service
public class AccountService {
	private static final Log log = LogFactory.getLog(AccountService.class);
	
	@Autowired
	AccountDao accountDao;
	
	@Autowired
	ShellService shellService;
	
	@Autowired
	RoomService rService;
	
	@Autowired
	CodeDao codeDao;
	
	@Autowired
	NewLiveRecordService nliveRecordService;
	
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
			log.error("Logout failed. Token is wrong.");
			return;
		}
		
		//退出所创建的房间
		rService.exitByUid(account.getUid());
		
		//删除直播记录
		nliveRecordService.deleteByHostUid(account.getUid());
		
		//退出账户
		logout(account);
		
		resultMap.put("errorCode", Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success!");
		log.info("Success to logout. User is " + account.getUid());
		return;
	}

	public void login(String id, String pwd, Map<String, Object> resultMap) {
		
		pwd = CommonUtil.sha256(pwd);
		
		Account account = accountDao.queryById(id);
		if(account == null) {
			account = accountDao.queryByEmail(id);
		}
		
		//账号验证
		if(account == null) {
			resultMap.put("success", false);
    		resultMap.put("data", "用户名或密码不正确");
			return;
		}
		
		//密码验证
		if(!pwd.equals(account.getPwd())) {
			resultMap.put("success", false);
    		resultMap.put("data", "用户名或密码不正确");
			return;
		}
		
		resultMap.put("success", true);
	}
	
	public void login(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		
		//参数验证
		if(!map.containsKey("id") || !map.containsKey("pwd")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			log.error("Error request json. Json is " + jsonStr);
			return;
		}
		
		String id = String.valueOf(map.get("id"));
		String pwd = String.valueOf(map.get("pwd"));
		pwd = CommonUtil.sha256(pwd);
		
		Account account = accountDao.queryById(id);
		if(account == null) {
			account = accountDao.queryByEmail(id);
			
			if(account == null) {
				account = accountDao.queryByName(id);
			}
		}
		
		//账号验证
		if(account == null) {
			resultMap.put("errorCode",Constants.ERR_USER_NOT_EXIST);
			resultMap.put("errorInfo", "User not exist.");
			log.error("User not exist. User is " + id);
			return;
		}
		
		//密码验证
		if(!pwd.equals(account.getPwd())) {
			resultMap.put("errorCode",Constants.ERR_PASSWORD);
			resultMap.put("errorInfo", "User password error.");
			log.error("User password error.");
			return;
		}
		
		/*if(account.getCode_status() == 0) {
			resultMap.put("errorCode", Constants.ERR_CODE_CHECK);
			resultMap.put("errorInfo", "Please check the code");
			log.error("Please check the code.");
			return;
		}*/
		
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
		if(account.getState().equals(CommonUtil.ACCOUNT_STATE_1)) {
			resultMap.put("errorCode", Constants.ERR_SUCCESS);
			resultMap.put("errorInfo", "success");
			Map<String, Object> dataMap = new HashMap<String, Object>();
			dataMap.put("token", account.getToken());
			dataMap.put("name", account.getName());
			dataMap.put("role", account.getRole());
			dataMap.put("userSig", account.getUser_sig());
			dataMap.put("codeStatus", account.getCode_status());
			dataMap.put("id", account.getUid());
			dataMap.put("email", account.getEmail());
			resultMap.put("data", dataMap);
			log.info("User has been login. User is " + id);
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
			dataMap.put("name", account.getName());
			dataMap.put("userSig", account.getUser_sig());
			dataMap.put("role", account.getRole());
			dataMap.put("id", account.getUid());
			dataMap.put("email", account.getEmail());
			resultMap.put("data", dataMap);
		}
		log.info("Success to login. Id is " + id);
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
		
		String email = null;
		if(map.get("email") != null) {
			email = String.valueOf(map.get("email"));
		}
		
		String name = null;
		if(map.get("name") != null) {
			name = String.valueOf(map.get("name"));
		}
		
		String code = null;
		if(map.get("code") != null) {
			code = String.valueOf(map.get("code"));
		}
		
		pwd = CommonUtil.sha256(pwd);
		
		Account account = accountDao.queryById(id);
		
		if(account != null) {
			resultMap.put("errorCode",Constants.ERR_REGISTER_USER_EXIST);
			resultMap.put("errorInfo", "Register user id existed.");
			log.error("Register user id is exist. Id is " + id);
			return;
		}
		
		if(!StringUtils.isBlank(email)) {
			Account emailAccount = accountDao.queryByEmail(email); 
			if(emailAccount != null) {
				resultMap.put("errorCode",Constants.ERR_REGISTER_EMAIL_EXIST);
				resultMap.put("errorInfo", "Register user email existed.");
				log.error("Register user email is exist. Email is " + email);
				return;
			}
		}
		
		if(StringUtils.isNotBlank(code)) {
			if(!"666666".equals(code)) {
				Code queryCode = new Code();
				queryCode.setCode_value(code);
				queryCode.setExpired(CommonUtil.CODE_EXPIRED_0);
				
				List<Code> codeList = codeDao.query(queryCode);
				if(codeList.size() == 0) {
					resultMap.put("errorCode",Constants.ERR_CODE);
					resultMap.put("errorInfo", "Code does not exist.");
					return;
				} else {
					Code c = codeList.get(0);
					c.setExpired(CommonUtil.CODE_EXPIRED_1);
					codeDao.update(c);
				}
			}
		}
		
		if(!StringUtils.isBlank(name)) {
			Account nameAccount = accountDao.queryByName(name); 
			if(nameAccount != null) {
				resultMap.put("errorCode",Constants.ERR_REGISTER_NAME_EXIST);
				resultMap.put("errorInfo", "Register user name existed.");
				log.error("Register user name is exist. Name is " + name);
				return;
			}
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
		account.setExpert_status(CommonUtil.CURRENT_EXPERT);
		account.setEmail(email);
		account.setName(name);
		
		int count = accountDao.insert(account);
		
		if(count < 1) {
			resultMap.put("errorCode",Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server inner error, Regist fail!");
		} else {
			resultMap.put("errorCode", Constants.ERR_SUCCESS);
			resultMap.put("errorInfo", "success");
		}
		
		log.info("Register user success. Id is " + id);
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

	public Account queryById(String uid) {
		return accountDao.queryById(uid);
	}
	
}
