package live.server.dao;

import live.server.model.Account;

public interface AccountDao {

	public Account queryById(String id);

	public int insert(Account account);

	public int update(Account account);

	public Account queryByToken(String token);

	public int logout(Account account);

	public Account queryByEmail(String email);

}
