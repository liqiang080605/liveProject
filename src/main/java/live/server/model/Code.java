package live.server.model;

public class Code {
	private Integer id;
	
	private String uid;
	
	private String code_value;
	
	private String create_time;
	
	private Integer expired;
	
	private Integer offset;
	
	private Integer limit;

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
