package live.server.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;
import live.server.dao.NewLiveRecordDao;
import live.server.model.InteractAvRoom;
import live.server.model.NewLiveRecord;

@Service
public class NewLiveRecordService {
	private static final Log log = LogFactory.getLog(NewLiveRecordService.class);
	
	@Autowired
	NewLiveRecordDao nliveRecordDao;

	public boolean getPlayUrl(NewLiveRecord nliveRecord) {
		String livecode = nliveRecord.getAv_room_id() + "_" + nliveRecord.getHost_uid();
		
		if(nliveRecord.getVideo_type() == 0) {
			livecode += "_main";
		} else if (nliveRecord.getVideo_type() == 1) {
			livecode += "_aux";
		} else {
			return false;
		}
		
		String md5sum = CommonUtil.md5(livecode);
		livecode = CommonUtil.BIZID + "_" + md5sum;
        nliveRecord.setPlay_url1("rtmp://" + CommonUtil.BIZID + "." + CommonUtil.LIVE_URLS + livecode);
        nliveRecord.setPlay_url2("http://" + CommonUtil.BIZID + "." + CommonUtil.LIVE_URLS + livecode + ".flv");
        nliveRecord.setPlay_url3("http://" + CommonUtil.BIZID + "." + CommonUtil.LIVE_URLS + livecode + ".m3u8");
        
        return true;
	}

	public int save(NewLiveRecord nliveRecord) {
		nliveRecord.setCreate_time(new Date());
		nliveRecord.setModify_time(String.valueOf(System.currentTimeMillis()/1000));
		
		return nliveRecordDao.replaceInsert(nliveRecord);
	}

	public List<NewLiveRecord> getLiveRoomList(int index, int size, String type, String appid) {
		NewLiveRecord queryNLR = new NewLiveRecord();
		if(StringUtils.isBlank(appid)) {
			queryNLR.setAppid(null);
		} else {
			queryNLR.setAppid(Integer.valueOf(appid));
		}
		queryNLR.setRoom_type(type);
		queryNLR.setOffset(index);
		queryNLR.setLimit(size);
		
		return nliveRecordDao.query(queryNLR);
	}

	public int countByAppId(String appid) {
		Integer queryAppId = null;
		if(!StringUtils.isBlank(appid)) {
			queryAppId = Integer.valueOf(appid);
		}
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("appid", queryAppId);
		
		return nliveRecordDao.countByAppId(map);
	}

	public List<NewLiveRecord> queryByAVRoomId(int roomnum) {
		NewLiveRecord queryNLR = new NewLiveRecord();
		queryNLR.setAv_room_id(roomnum);
		return nliveRecordDao.query(queryNLR);
	}

}
