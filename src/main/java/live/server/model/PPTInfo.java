package live.server.model;

public class PPTInfo {
	
	Integer id;
	
	String uid;
	
	String name;
	
	String uuid;
	
	String server_url;
	
	String customer_url;
	
	String status;
	
	String create_time;
	
	Integer offset;
	
	Integer limit;

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

	public Integer getId() {
		return id;
	}

	public String getUid() {
		return uid;
	}

	public String getName() {
		return name;
	}

	public String getUuid() {
		return uuid;
	}

	public String getServer_url() {
		return server_url;
	}

	public String getCustomer_url() {
		return customer_url;
	}

	public String getCreate_time() {
		return create_time;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public void setServer_url(String server_url) {
		this.server_url = server_url;
	}

	public void setCustomer_url(String customer_url) {
		this.customer_url = customer_url;
	}

	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
}
