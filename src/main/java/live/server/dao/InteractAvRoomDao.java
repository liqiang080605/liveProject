package live.server.dao;

import java.util.List;

import live.server.model.InteractAvRoom;

public interface InteractAvRoomDao {

	int replaceInsert(InteractAvRoom iavRoom);

	int countByRoomId(Integer av_room_id);

	void deleteByUid(String uid);

	List<InteractAvRoom> query(InteractAvRoom iaRoom);

	void update(InteractAvRoom iaRoom);

	void deleteByRoomId(int roomnum);

	void deleteDeathRoom(InteractAvRoom iavRoom);

	void delete(InteractAvRoom iaRoom);

}
