package live.server.dao;

import java.util.List;
import java.util.Map;

import live.server.model.NewLiveRecord;

public interface NewLiveRecordDao {

	int replaceInsert(NewLiveRecord nliveRecord);

	List<NewLiveRecord> query(NewLiveRecord queryNLR);

	int countByAppId(Map<String, Object> map);

}
