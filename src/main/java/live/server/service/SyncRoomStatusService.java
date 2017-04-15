package live.server.service;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.dao.InteractAvRoomDao;
import live.server.dao.NewLiveRecordDao;
import live.server.dao.RoomDao;
import live.server.model.AvRoom;
import live.server.model.InteractAvRoom;
import live.server.model.NewLiveRecord;

@Service
public class SyncRoomStatusService {
	
	private static final Log log = LogFactory.getLog(SyncRoomStatusService.class);

	private static final long DEATH_TIME = 1 * 60;
	
	@Autowired
	RoomDao roomDao;
	
	@Autowired
	InteractAvRoomDao iavRoomDao;
	
	@Autowired
	NewLiveRecordDao nliveRecordDao;

	public void delDeathRoom() {
		String time = String.valueOf(System.currentTimeMillis()/1000 - DEATH_TIME);
		
		AvRoom room = new AvRoom();
		room.setLast_update_time(time);
		roomDao.deleteDeathRoom(room);
		
		InteractAvRoom iavRoom = new InteractAvRoom();
		iavRoom.setModify_time(time);
		iavRoomDao.deleteDeathRoom(iavRoom);
		
		NewLiveRecord nlRecord = new NewLiveRecord();
		nlRecord.setModify_time(time);
		nliveRecordDao.deleteDeathRoom(nlRecord);
	}

}
