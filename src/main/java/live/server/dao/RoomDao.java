package live.server.dao;

import live.server.model.AvRoom;

public interface RoomDao {

	AvRoom queryByUid(String uid);

	int update(AvRoom room);

	void insert(AvRoom room);

}
