package live.server.model;

import java.util.Date;

public class NewLiveRecord {
	Integer id;
	
	Date create_time;
	
	String modify_time;
	
	Integer appid;
	
	String title;
	
	String cover;
	
	String host_uid;
	
	Integer av_room_id;
	
	String chat_room_id;
	
	String room_type;
	
	Integer admire_count;
	
	Double longitude;
	
	Double latitude;
	
	String address;
	
	Integer video_type;
	
	Integer device;
	
	String play_url1;
	
	String play_url2;
	
	String play_url3;

	public Integer getId() {
		return id;
	}

	public Date getCreate_time() {
		return create_time;
	}

	public Integer getAppid() {
		return appid;
	}

	public String getTitle() {
		return title;
	}

	public String getCover() {
		return cover;
	}

	public String getHost_uid() {
		return host_uid;
	}

	public Integer getAv_room_id() {
		return av_room_id;
	}

	public String getChat_room_id() {
		return chat_room_id;
	}

	public String getRoom_type() {
		return room_type;
	}

	public Integer getAdmire_count() {
		return admire_count;
	}

	public Double getLongitude() {
		return longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public String getAddress() {
		return address;
	}

	public Integer getVideo_type() {
		return video_type;
	}

	public Integer getDevice() {
		return device;
	}

	public String getPlay_url1() {
		return play_url1;
	}

	public String getPlay_url2() {
		return play_url2;
	}

	public String getPlay_url3() {
		return play_url3;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setCreate_time(Date create_time) {
		this.create_time = create_time;
	}

	public String getModify_time() {
		return modify_time;
	}

	public void setModify_time(String modify_time) {
		this.modify_time = modify_time;
	}

	public void setAppid(Integer appid) {
		this.appid = appid;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setCover(String cover) {
		this.cover = cover;
	}

	public void setHost_uid(String host_uid) {
		this.host_uid = host_uid;
	}

	public void setAv_room_id(Integer av_room_id) {
		this.av_room_id = av_room_id;
	}

	public void setChat_room_id(String chat_room_id) {
		this.chat_room_id = chat_room_id;
	}

	public void setRoom_type(String room_type) {
		this.room_type = room_type;
	}

	public void setAdmire_count(Integer admire_count) {
		this.admire_count = admire_count;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setVideo_type(Integer video_type) {
		this.video_type = video_type;
	}

	public void setDevice(Integer device) {
		this.device = device;
	}

	public void setPlay_url1(String play_url1) {
		this.play_url1 = play_url1;
	}

	public void setPlay_url2(String play_url2) {
		this.play_url2 = play_url2;
	}

	public void setPlay_url3(String play_url3) {
		this.play_url3 = play_url3;
	}

}
