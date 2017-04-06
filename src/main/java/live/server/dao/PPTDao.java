package live.server.dao;

import java.util.List;

import live.server.model.PPTInfo;

public interface PPTDao {

	List<PPTInfo> query(PPTInfo queryInfo);

	int insert(PPTInfo queryInfo);

	void deleteByUUID(String uuid);

	int count();

}
