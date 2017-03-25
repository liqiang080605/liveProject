package live.server.service;

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

}
