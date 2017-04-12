package live.server.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.server.dao.HospitalsDao;
import live.server.model.Hospital;

@Service
public class HospitalService {

	private static final Log log = LogFactory.getLog(CodeService.class);
	
	@Autowired
	HospitalsDao hospitalDao;

	public int countAllHospitals() {
		return hospitalDao.count();
	}

	public List<Hospital> queryAllHospitalsByOffset(int offset, int limit) {
		Hospital h = new Hospital();
		
		List<Hospital>  list = hospitalDao.query(h);
		
		return list;
	}

	public void addHospital(Hospital h) {
		hospitalDao.insert(h);
	}

	public void modifyHospital(Hospital h) {
		hospitalDao.update(h);
	}

	public String deleteGroup(String[] ids) {
		int totalLen = ids.length;
		
		List<String> deleteIDs = new ArrayList<String>();
		
		for(String id : ids) {
			hospitalDao.delete(Integer.valueOf(id));
			
			if(hospitalDao.queryById(Integer.valueOf(id)) == null ) {
				deleteIDs.add(id);
			}
		}
		
		int delSize = deleteIDs.size();
		String msg = "操作成功";
		if (totalLen != delSize) {
			msg = "共需删除:" + totalLen + "条,成功:" + delSize + "条.";
		}

		return msg;
	}
}
