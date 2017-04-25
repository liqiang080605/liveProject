package live.server.service;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.dao.InteractAvRoomDao;
import live.server.model.InteractAvRoom;

@Service
public class IavRoomService {
	private static final Log log = LogFactory.getLog(IavRoomService.class);

	@Autowired
	InteractAvRoomDao iavRoomDao;
	
	public void enterRoom(InteractAvRoom iavRoom) {
		iavRoomDao.replaceInsert(iavRoom);
	}

	public int countByRoomId(Integer av_room_id) {
		return iavRoomDao.countByRoomId(av_room_id);
	}

	public void exitRoom(InteractAvRoom iaRoom) {
        iavRoomDao.deleteByUid(iaRoom.getUid());
	}

	public List<InteractAvRoom> query(InteractAvRoom iaRoom) {
		return iavRoomDao.query(iaRoom);
	}

	public void updateLastUpdateTimeByUid(InteractAvRoom iaRoom) {
		iavRoomDao.updateLastUpdateTimeByUid(iaRoom);
	}

	public void update(InteractAvRoom iavRoom) {
		iavRoomDao.update(iavRoom);
	}

	public void clearRoomByRoomNum(int roomnum) {
		iavRoomDao.deleteByRoomId(roomnum);
		
	}

	public void clearRoomByUidAndRoomId(InteractAvRoom iaRoom) {
		iavRoomDao.delete(iaRoom);
	}

}
