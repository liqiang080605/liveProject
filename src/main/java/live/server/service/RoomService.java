package live.server.service;

import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;
import live.server.Util.Constants;
import live.server.dao.RoomDao;
import live.server.model.AvRoom;

@Service
public class RoomService {

	private static final Log log = LogFactory.getLog(RoomService.class);
	
	@Autowired
	RoomDao roomDao;
	
	public int load(String uid, Map<String, Object> resultMap) {
		AvRoom room = roomDao.queryByUid(uid);
		
		if(room == null) {
			return 0;
		}
		
		if(StringUtils.isBlank(room.getAux_md5()) || StringUtils.isBlank(room.getMain_md5())) {
			int result = createStreamIdMd5(room);
			
			if(result < 1) {
				log.error("Update aux_md5 and main_md5 failed! room id is " 
							+ room.getId() + ".uid is " + room.getUid());
				resultMap.put("errorCode", Constants.ERR_SERVER);
				resultMap.put("errorInfo", "Update aux_md5 and main_md5 failed!");
				return -1;
			}
		}
		
		return 1;
	}

	private int createStreamIdMd5(AvRoom room) {
		// TODO Auto-generated method stub
		String aux_md5 = CommonUtil.md5(room.getId() + "_" + room.getUid() + "_aux");
		String main_md5 = CommonUtil.md5(room.getId() + "_" + room.getUid() + "_main");
		
		room.setAux_md5(aux_md5);
		room.setMain_md5(main_md5);
		return roomDao.update(room);
	}

	public boolean create(String uid, Map<String, Object> resultMap) {
		// TODO Auto-generated method stub
		AvRoom room = new AvRoom();
		room.setUid(uid);
		room.setLast_update_time(String.valueOf(System.currentTimeMillis()/1000));
		roomDao.insert(room);
		
		AvRoom insertRoom = roomDao.queryByUid(uid);
		int result = createStreamIdMd5(insertRoom);
		if(result < 1) {
			log.error("Update aux_md5 and main_md5 failed! room id is " 
					+ room.getId() + ".uid is " + room.getUid());
			return false;
		}
		
		return true;
	}

	public AvRoom getRoom(String uid) {
		return roomDao.queryByUid(uid);
	}

	public void exitByUid(String uid) {
		roomDao.deleteByUid(uid);
	}

	public void updateLastUpdateTime(AvRoom room) {
		roomDao.updateLastUpdateTime(room);
	}

}
