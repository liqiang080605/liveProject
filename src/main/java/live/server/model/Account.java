package live.server.model;

public class Account {
	String uid;
	
	String name;
	
	String pwd;
	
	Integer role;
	
	String token;
	
	Integer state;
	
	String user_sig;
	
	String register_time;
	
	String login_time;
	
	String logout_time;
	
	String last_request_time;
	
	Integer code_status;
	
	String email;
	
	String expert_status;
	
	Integer offset;
	
	Integer limit;

	public String getUid() {
		return uid;
	}

	public String getPwd() {
		return pwd;
	}

	public String getToken() {
		return token;
	}

	public Integer getState() {
		return state;
	}

	public String getUser_sig() {
		return user_sig;
	}

	public String getRegister_time() {
		return register_time;
	}

	public String getLogin_time() {
		return login_time;
	}

	public String getLogout_time() {
		return logout_time;
	}

	public String getLast_request_time() {
		return last_request_time;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	public void setUser_sig(String user_sig) {
		this.user_sig = user_sig;
	}

	public void setRegister_time(String register_time) {
		this.register_time = register_time;
	}

	public void setLogin_time(String login_time) {
		this.login_time = login_time;
	}

	public void setLogout_time(String logout_time) {
		this.logout_time = logout_time;
	}

	public void setLast_request_time(String last_request_time) {
		this.last_request_time = last_request_time;
	}

	public Integer getRole() {
		return role;
	}

	public void setRole(Integer role) {
		this.role = role;
	}

	public Integer getCode_status() {
		return code_status;
	}

	public void setCode_status(Integer code_status) {
		this.code_status = code_status;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getExpert_status() {
		return expert_status;
	}

	public void setExpert_status(String expert_status) {
		this.expert_status = expert_status;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
