package live.server.dao;

import java.util.List;

import live.server.model.Hospital;

public interface HospitalsDao {

	int count();

	List<Hospital> query(Hospital h);
	
	int insert(Hospital h);
	
	int delete(int id);

	void update(Hospital h);

	Hospital queryById(Integer id);
}
