package live.server.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.Util.CommonUtil;
import live.server.Util.Constants;
import live.server.Util.JsonUtil;
import live.server.dao.AccountDao;
import live.server.model.Account;
import live.server.model.AvRoom;
import live.server.model.InteractAvRoom;
import live.server.model.NewLiveRecord;
import live.server.model.UserRole;
import live.server.shell.ShellService;

@Service
public class LiveService {
	private static final Log log = LogFactory.getLog(LiveService.class);
	
	@Autowired
	RoomService roomService;
	
	@Autowired
	AccountService accountService;
	
	@Autowired
	IavRoomService iavRoomService;
	
	@Autowired
	NewLiveRecordService nliveRecordService;
	
	public void exec(String cmd, String jsonStr, Map<String, Object> resultMap) {
		if(cmd.equals("create")) {
			createRoom(jsonStr, resultMap);
		} else if(cmd.equals("reportroom")) {
			reportRoom(jsonStr, resultMap);
		} else if (cmd.equals("roomlist")) {
			roomlist(jsonStr, resultMap);
		} else if (cmd.equals("reportmemid")) {
			reportmemid(jsonStr, resultMap);
		} else if (cmd.equals("roomidlist")) {
			roomidlist(jsonStr, resultMap);
		} else {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Cmd is error.");
			return;
		}
	}

	private void roomidlist(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token") || !map.containsKey("index") || !map.containsKey("size") || !map.containsKey("roomnum")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		String token = String.valueOf(map.get("token"));
		int index = Integer.valueOf(String.valueOf(map.get("index")));
		int size = Integer.valueOf(String.valueOf(map.get("size")));
		int roomnum = Integer.valueOf(String.valueOf(map.get("roomnum")));
		
		Account account = accountService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!accountService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		InteractAvRoom iavRoom = new InteractAvRoom();
		iavRoom.setUid(account.getUid());
		iavRoom.setAv_room_id(roomnum);
		iavRoom.setOffset(index);
		iavRoom.setLimit(size);
		List<InteractAvRoom> list = iavRoomService.query(iavRoom);
		
		int count = iavRoomService.countByRoomId(iavRoom.getAv_room_id());
		
		resultMap.put("errorCode",Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success.");
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("total", count);
		
		List<Map<String, Object>> memList = new ArrayList<Map<String, Object>>();
		for(InteractAvRoom iav : list) {
			Map<String, Object> iavMap = new HashMap<String, Object>();
			iavMap.put("id", iav.getUid());
			iavMap.put("role", iav.getRole());
			memList.add(iavMap);
		}
		
		dataMap.put("idlist", memList);
		resultMap.put("data", dataMap);
	}

	private void reportmemid(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token") || !map.containsKey("operate") || !map.containsKey("roomnum") || !map.containsKey("role")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		
		String token = String.valueOf(map.get("token"));
		int operate = Integer.valueOf(String.valueOf(map.get("operate")));
		int roomnum = Integer.valueOf(String.valueOf(map.get("roomnum")));
		int role = Integer.valueOf(String.valueOf(map.get("role")));
		
		Account account = accountService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!accountService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		InteractAvRoom iaRoom = new InteractAvRoom();
		iaRoom.setUid(account.getUid());
		iaRoom.setAv_room_id(roomnum);
		iaRoom.setStatus("off");
		iaRoom.setRole(role);
		iaRoom.setModify_time(String.valueOf(System.currentTimeMillis()/1000));
		
		List<NewLiveRecord> list = nliveRecordService.queryByAVRoomId(roomnum);
		if(list.size() == 0) {
			resultMap.put("errorCode",Constants.ERR_AV_ROOM_NOT_EXIST);
			resultMap.put("errorInfo", "av room is not exist.");
			return;
		}
		
		if(operate == 0) {
			iavRoomService.enterRoom(iaRoom);
		} else {
			iavRoomService.exitRoom(iaRoom);
		}
		
		resultMap.put("errorCode",Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success.");
	}

	private void roomlist(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token") || !map.containsKey("index") || !map.containsKey("size")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		String token = String.valueOf(map.get("token"));
		int index = Integer.valueOf(String.valueOf(map.get("index")));
		int size = Integer.valueOf(String.valueOf(map.get("size")));
		String type = getValueFromMap(map, "type");
		String appid = getValueFromMap(map, "appid");
		
		Account account = accountService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!accountService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		List<NewLiveRecord> list = nliveRecordService.getLiveRoomList(index, size, type, appid);
		int count = nliveRecordService.countByAppId(appid);
		
		
		resultMap.put("errorCode",Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success");
		
		Map<String, Object> dataMap = new HashMap<String, Object>();
		resultMap.put("data", dataMap);
		dataMap.put("total", count);
		
		List<Map<String, Object>>roomsList = new ArrayList<Map<String, Object>>();
		dataMap.put("rooms", roomsList);
		
		for(NewLiveRecord nlr : list) {
			Map<String, Object> roomMap = new HashMap<String, Object>();
			roomMap.put("uid", nlr.getHost_uid());
			
			Map<String, Object> infoMap = new HashMap<String, Object>();
			int memberSize = iavRoomService.countByRoomId(nlr.getAv_room_id());
			infoMap.put("title", nlr.getTitle());
			infoMap.put("roomnum", nlr.getAv_room_id());
			infoMap.put("type", nlr.getRoom_type());
			infoMap.put("groupid", nlr.getChat_room_id());
			infoMap.put("cover", nlr.getCover());
			infoMap.put("thumbup", nlr.getAdmire_count());
			infoMap.put("memsize", memberSize);
			
			roomMap.put("info", infoMap);
			
			roomsList.add(roomMap);
		}
	}

	private void reportRoom(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		
		//参数验证
		if(!map.containsKey("token") || !map.containsKey("room")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		String token = String.valueOf(map.get("token"));
		
		Account account = accountService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!accountService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		Map<String, Object> roomMap = (Map<String, Object>) map.get("room");
		if(!roomMap.containsKey("type") || !roomMap.containsKey("roomnum")
				|| !roomMap.containsKey("groupid") || !roomMap.containsKey("host")
				|| !roomMap.containsKey("device") || !roomMap.containsKey("videotype")
				|| !roomMap.containsKey("appid")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Request room params is wrong.");
			return;
		}
		
		NewLiveRecord nliveRecord = new NewLiveRecord();
		nliveRecord.setHost_uid(account.getUid());
		init(nliveRecord, roomMap);
		
		if(!nliveRecordService.getPlayUrl(nliveRecord)) {
			resultMap.put("errorCode",Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server internal error: gen play url fail.");
			return;
		}
		
		int count = nliveRecordService.save(nliveRecord);
		if(count < 1) {
			resultMap.put("errorCode",Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Server internal error.");
			return;
		}
		
		resultMap.put("errorCode",Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success.");
	}

	private void init(NewLiveRecord record, Map<String, Object> roomMap) {
		record.setTitle(getValueFromMap(roomMap, "title"));
		record.setCover(getValueFromMap(roomMap, "cover"));
		record.setRoom_type(getValueFromMap(roomMap, "type"));
		record.setAv_room_id(Integer.valueOf(getValueFromMap(roomMap, "roomnum")));
		record.setChat_room_id(getValueFromMap(roomMap, "groupid"));
		record.setDevice(Integer.valueOf(getValueFromMap(roomMap, "device")));
		record.setVideo_type(Integer.valueOf(getValueFromMap(roomMap, "videotype")));
		record.setAppid(Integer.valueOf(getValueFromMap(roomMap, "appid")));
		record.setAdmire_count(0);
		
		if(roomMap.containsKey("lbs")) {
			Map<String, Object> lbsMap = (Map<String, Object>) roomMap.get("lbs");
			record.setLongitude(Double.valueOf(getValueFromMap(lbsMap, "longitude")));
			record.setLatitude(Double.valueOf(getValueFromMap(lbsMap, "latitude")));
			record.setAddress(getValueFromMap(lbsMap, "address"));
		} else {
			record.setLongitude(0d);
			record.setLatitude(0d);
			record.setAddress("");
		}
	}
	
	private String getValueFromMap(Map<String, Object> map, String key) {
		Object v = map.get(key);
		if(v == null) {
			return "";
		} else {
			return String.valueOf(v);
		}
	}

	private void createRoom(String jsonStr, Map<String, Object> resultMap) {
		Map<String, Object> map = JsonUtil.jsonToMap(jsonStr);
		if(!map.containsKey("token") || !map.containsKey("type")) {
			resultMap.put("errorCode",Constants.ERR_REQ_DATA);
			resultMap.put("errorInfo", "Error request json.");
			return;
		}
		
		String token = String.valueOf(map.get("token"));
		
		Account account = accountService.queryByToken(token);
		if(account == null) {
			log.error("Token is wrong!");
			resultMap.put("errorCode", Constants.ERR_SERVER);
			resultMap.put("errorInfo", "Token is wrong!");
			return;
		}
		
		if(!accountService.checkToken(token)) {
			resultMap.put("errorCode",Constants.ERR_TOKEN_EXPIRE);
			resultMap.put("errorInfo", "User token expired.");
			return;
		}
		
		if(account.getRole() < UserRole.ADMIN.getRole()) {
			resultMap.put("errorCode",Constants.ERR_AUTH_CREATEROOM);
			resultMap.put("errorInfo", "User has no pemission to create room.");
			return;
		}
		
		int loadResult = roomService.load(account.getUid(), resultMap);
		
		if(loadResult < 0) {
			return;
		}
		
		if(loadResult == 0) {
			if(!roomService.create(account.getUid(), resultMap)) {
				resultMap.put("errorCode", Constants.ERR_SERVER);
				resultMap.put("errorInfo", "Server internal error: create av room fail.");
				return;
			}
		}
		
		AvRoom room = roomService.getRoom(account.getUid());
		
		InteractAvRoom iavRoom = new InteractAvRoom();
		iavRoom.setUid(account.getUid());
		iavRoom.setAv_room_id(room.getId());
		iavRoom.setStatus("off");
		iavRoom.setRole(1);
		iavRoom.setModify_time(String.valueOf(System.currentTimeMillis()/1000));
		
		iavRoomService.enterRoom(iavRoom);
		
		resultMap.put("errorCode", Constants.ERR_SUCCESS);
		resultMap.put("errorInfo", "success");
		Map<String, Object> dataMap = new HashMap<String, Object>();
		dataMap.put("roomnum", Integer.valueOf(room.getId()));
		dataMap.put("groupid", room.getId());
		resultMap.put("data", dataMap);
	}
}
