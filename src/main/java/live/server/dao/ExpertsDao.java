package live.server.dao;

import live.server.model.Expert;

public interface ExpertsDao {

	Expert query(Expert queryExpert);
	
	int update(Expert expert);

	void insert(Expert expert);

	Expert queryById(Integer valueOf);

}
