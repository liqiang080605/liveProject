package live.server.model;

public class Expert {
	Integer id;
	
	String name;
	
	String password;
	
	String title;
	
	String level;
	
	String detail;
	
	String create_date;
	
	String update_date;
	
	Integer limit;
	
	Integer offset;

	public String getName() {
		return name;
	}

	public String getPassword() {
		return password;
	}

	public String getTitle() {
		return title;
	}

	public String getLevel() {
		return level;
	}

	public String getDetail() {
		return detail;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getLimit() {
		return limit;
	}

	public Integer getOffset() {
		return offset;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public String getCreate_date() {
		return create_date;
	}

	public String getUpdate_date() {
		return update_date;
	}

	public void setCreate_date(String create_date) {
		this.create_date = create_date;
	}

	public void setUpdate_date(String update_date) {
		this.update_date = update_date;
	}
	
}
