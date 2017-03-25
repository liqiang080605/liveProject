package live.server.model;

public class Account {
	String uid;
	
	String pwd;
	
	String token;
	
	Integer state;
	
	String user_sig;
	
	String register_time;
	
	String login_time;
	
	String logout_time;
	
	String last_request_time;

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

}
