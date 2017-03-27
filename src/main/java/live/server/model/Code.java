package live.server.model;

public class Code {
	private Integer id;
	
	private String uid;
	
	private String code_value;
	
	private String create_time;
	
	private Integer expired;

	public Integer getId() {
		return id;
	}

	public String getUid() {
		return uid;
	}

	public String getCreate_time() {
		return create_time;
	}

	public Integer getExpired() {
		return expired;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}

	public void setExpired(Integer expired) {
		this.expired = expired;
	}

	public String getCode_value() {
		return code_value;
	}

	public void setCode_value(String code_value) {
		this.code_value = code_value;
	}
}
