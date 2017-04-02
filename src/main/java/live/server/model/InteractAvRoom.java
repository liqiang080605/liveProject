package live.server.model;

public class InteractAvRoom {
	String uid;
	
	Integer av_room_id;
	
	String status;
	
	String modify_time;
	
	Integer role;
	
	Integer offset;
	
	Integer limit;

	public String getUid() {
		return uid;
	}

	public Integer getAv_room_id() {
		return av_room_id;
	}

	public String getStatus() {
		return status;
	}

	public Integer getRole() {
		return role;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public void setAv_room_id(Integer av_room_id) {
		this.av_room_id = av_room_id;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setRole(Integer role) {
		this.role = role;
	}

	public String getModify_time() {
		return modify_time;
	}

	public void setModify_time(String modify_time) {
		this.modify_time = modify_time;
	}

	public Integer getOffset() {
		return offset;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

}
