package live.server.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;
import live.server.dao.AccountDao;
import live.server.dao.ExpertsDao;
import live.server.model.Account;
import live.server.model.Expert;
import live.server.model.UserRole;

@Service
public class ExpertsService {

	private static final Log log = LogFactory.getLog(CodeService.class);
	
	@Autowired
	AccountDao accountDao;
	
	@Autowired
	ExpertsDao expertsDao;

	public int countAllCurrentExperts(String expertStatus) {
		Account queryAccount = new Account();
		queryAccount.setRole(UserRole.EXPERT.getRole());
		queryAccount.setExpert_status(expertStatus);
		
		List<Account> list = accountDao.query(queryAccount);
		
		return list.size();
	}

	public List<Expert> queryCurrentExpertsByOffset(String currentExpert, int offset, int limit) {
		Account queryAccount = new Account();
		queryAccount.setRole(UserRole.EXPERT.getRole());
		queryAccount.setExpert_status(currentExpert);
		queryAccount.setOffset(offset);
		queryAccount.setLimit(limit);
		
		List<Account> list = accountDao.query(queryAccount);
		
		List<Expert> expertList = new ArrayList<Expert>();
		
		for(Account a : list) {
			Expert queryExpert = new Expert();
			queryExpert.setName(a.getUid());
			
			Expert expert = expertsDao.query(queryExpert);
			if(expert == null) {
				expertList.add(queryExpert);
			} else {
				expertList.add(expert);
			}
		}
		
		return expertList;
	}

	public void addExperts(String name, String title, String level, String detail) {
		Account account = new Account();
		account.setUid(name);
		account.setPwd(CommonUtil.sha256("123456"));
		account.setLast_request_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setLogin_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setLogout_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setRegister_time(String.valueOf(System.currentTimeMillis()/1000));
		account.setState(0);
		account.setRole(UserRole.EXPERT.getRole());
		account.setCode_status(0);
		account.setExpert_status(CommonUtil.CURRENT_EXPERT);
		
		accountDao.insert(account);
		
		Expert expert = new Expert();
		expert.setName(name);
		expert.setTitle(title);
		expert.setLevel(level);
		expert.setDetail(detail);
		
		expertsDao.insert(expert);
	}

	public void updateToHistory(String[] ids) {
		updateExpertsStatus(ids, CommonUtil.HISTORY_EXPERT);
	}

	public void updateToCurrent(String[] ids) {
		updateExpertsStatus(ids, CommonUtil.CURRENT_EXPERT);
	}
	
	private void updateExpertsStatus(String[] ids, String status) {
		for(String id : ids) {
			Expert expert = expertsDao.queryById(Integer.valueOf(id));
			if(expert != null) {
				Account a = new Account();
				a.setExpert_status(status);
				a.setUid(expert.getName());
				a.setLast_request_time(String.valueOf(System.currentTimeMillis()/1000));
				
				accountDao.update(a);
			}
			
		}
	}
}
