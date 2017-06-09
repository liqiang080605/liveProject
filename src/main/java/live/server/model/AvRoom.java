package live.server.model;

public class AvRoom {
	Integer id;
	
	String uid;
	
	String name;
	
	String subname;
	
	String aux_md5;
	
	String main_md5;
	
	String last_update_time;

	public Integer getId() {
		return id;
	}

	public String getUid() {
		return uid;
	}

	public String getAux_md5() {
		return aux_md5;
	}

	public String getMain_md5() {
		return main_md5;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	public void setAux_md5(String aux_md5) {
		this.aux_md5 = aux_md5;
	}

	public void setMain_md5(String main_md5) {
		this.main_md5 = main_md5;
	}

	public String getLast_update_time() {
		return last_update_time;
	}

	public void setLast_update_time(String last_update_time) {
		this.last_update_time = last_update_time;
	}

	public String getName() {
		return name;
	}

	public String getSubname() {
		return subname;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setSubname(String subname) {
		this.subname = subname;
	}

}
