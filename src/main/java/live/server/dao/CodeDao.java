package live.server.dao;

import java.util.List;

import live.server.model.Code;

public interface CodeDao {

	void insert(Code code);

	List<Code> queryByUid(String uid);

	void update(Code code);

	List<Code> query(Code queryCode);

	int countAll();

	List<Code> queryAllCodeByOffset(Code code);

}
