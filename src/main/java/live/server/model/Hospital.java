package live.server.model;

import java.util.Date;

public class Hospital {
	Integer id;
	
	String name;
	
	String province;
	
	String city;
	
	String county;
	
	String address;
	
	String create_date;
	
	String update_date;
	
	Integer doctor_num;
	
	Integer offset;
	
	Integer limit;

	public Integer getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getProvince() {
		return province;
	}

	public String getCity() {
		return city;
	}

	public String getCounty() {
		return county;
	}

	public String getAddress() {
		return address;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public void setCounty(String county) {
		this.county = county;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public Integer getDoctor_num() {
		return doctor_num;
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

	public void setDoctor_num(Integer doctor_num) {
		this.doctor_num = doctor_num;
	}

	@Override
	public String toString() {
		return "Hospital [id=" + id + ", name=" + name + ", province=" + province + ", city=" + city + ", county="
				+ county + ", address=" + address + ", create_date=" + create_date + ", update_date=" + update_date
				+ ", doctor_num=" + doctor_num + ", offset=" + offset + ", limit=" + limit + "]";
	}

}
