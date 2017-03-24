package live.server.dao;

import live.server.model.Account;

public interface AccountDao {

	public Account queryById(String id);

	public int insert(Account account);

}
