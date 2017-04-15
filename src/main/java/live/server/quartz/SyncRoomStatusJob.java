package live.server.quartz;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

import live.server.service.SyncRoomStatusService;

@DisallowConcurrentExecution
public class SyncRoomStatusJob implements Job{

	private static final Log log = LogFactory.getLog(SyncRoomStatusJob.class);
	
	@Autowired
	SyncRoomStatusService syncRoomStatusService;
	
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		syncRoomStatusService.delDeathRoom();
		
	}

}
