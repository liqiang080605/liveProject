package live.server.quartz;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;

import live.server.service.PPTService;
import live.server.service.SyncRoomStatusService;

@DisallowConcurrentExecution
public class SyncRoomStatusJob implements Job{

	private static final Log log = LogFactory.getLog(SyncRoomStatusJob.class);
	
	@Autowired
	SyncRoomStatusService syncRoomStatusService;
	
	@Autowired
	PPTService pptService;
	
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		
		try {
			syncRoomStatusService.delDeathRoom();
			
			pptService.closeDeathPPT();
		} catch (Exception e) {
			log.error("Failed to sync room status. Exception is ", e);
		}
	}

}
