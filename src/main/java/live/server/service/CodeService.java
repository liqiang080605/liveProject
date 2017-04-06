package live.server.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;
import live.server.Util.Constants;
import live.server.Util.JsonUtil;
import live.server.dao.CodeDao;
import live.server.model.Account;
import live.server.model.Code;

@Service
public class CodeService {
	private static final Log log = LogFactory.getLog(CodeService.class);
	
	private static final int EXPIRED_TIME = 24 * 60 * 60;
	
	@Autowired
	AccountService accountService;
	
	@Autowired
	CodeDao codeDao;
	
	public void exec(String cmd, String jsonStr, Map<String, Object> resultMap) {
		if(cmd.equals("create")) {
			createCode(jsonStr, resultMap);
		} else if(cmd.equals("check")) {
			checkCode(jsonStr, resultMap);
		} else {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Cmd is error.");
			return;
		}
	}

	private void checkCode(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		
		//参数验证
		if(!map.containsKey("id") || !map.containsKey("code") || !map.containsKey("pwd")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		String uid = String.valueOf(map.get("id"));
		String password = String.valueOf(map.get("pwd"));
		String code_value = String.valueOf(map.get("code"));
		
		Account account = accountService.queryById(uid);
		if(account == null) {
			log.error("User or password is not wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "User or password is not wrong!");
			return;
		}
		
		if(!account.getPwd().equals(CommonUtil.sha256(password))) {
			log.error("User or password is not wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "User or password is not wrong!");
			return;
		}
		
		Code queryCode = new Code();
		queryCode.setCode_value(code_value);
		queryCode.setExpired(CommonUtil.CODE_EXPIRED_0);
		
		List<Code> codeList = codeDao.query(queryCode);
		if(codeList.size() == 0) {
			resultMap.put("errorCode",Constants.ERR_CODE_EXPIRE);
			resultMap.put("errorInfo", "Code is expired or does not exist.");
			return;
		} else {
			Code code = codeList.get(0);
			if(EXPIRED_TIME - (System.currentTimeMillis()/1000 - Integer.valueOf(code.getCreate_time())) <= 0) {
				resultMap.put("errorCode",Constants.ERR_CODE_EXPIRE);
				resultMap.put("errorInfo", "Code is expired.");
				code.setExpired(CommonUtil.CODE_EXPIRED_1);
				codeDao.update(code);
				return;
			}
			
			code.setExpired(CommonUtil.CODE_EXPIRED_1);
			codeDao.update(code);
		}
		
		account.setCode_status(1);
	    accountService.update(account);
	    
	    accountService.login(uid, password, resultMap);
	}

	private void createCode(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		
		String token = String.valueOf(map.get("token"));
		
		Account account = accountService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!accountService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		Code code = null;
		
		if(account.getRole() < 100) {
			resultMap.put("errorCode",Constants.ERR_CODE_NOPOWERAUTH);
			resultMap.put("errorInfo", "User has no auth to create code.");
			return;
		}
		
		List<Code> codeList = codeDao.queryByUid(account.getUid());
		if(codeList.size() > 0) {
			code = codeList.get(0);
			if(EXPIRED_TIME - (System.currentTimeMillis()/1000 - Integer.valueOf(code.getCreate_time())) > 0) {
				resultMap.put("errorCode",Constants.ERR_SUCCESS);
				resultMap.put("errorInfo", "success.");
				Map<String, Object> dataMap = new HashMap<String, Object>();
				dataMap.put("code", code.getCode_value());
				dataMap.put("time", EXPIRED_TIME - (System.currentTimeMillis()/1000 - Integer.valueOf(code.getCreate_time())));
				resultMap.put("data", dataMap);
				return;
			} else {
				code.setExpired(CommonUtil.CODE_EXPIRED_1);
				codeDao.update(code);
			}
		} 
		
		code = new Code();
		code.setUid(account.getUid());
		code.setCode_value(CommonUtil.getRandomCode());
		code.setCreate_time(String.valueOf(System.currentTimeMillis()/1000));
		code.setExpired(CommonUtil.CODE_EXPIRED_0);
		
		codeDao.insert(code);
		
		resultMap.put("errorCode",Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success.");
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("code", code.getCode_value());
		dataMap.put("time", EXPIRED_TIME - (System.currentTimeMillis()/1000 - Integer.valueOf(code.getCreate_time())));
		resultMap.put("data", dataMap);
	}
}
