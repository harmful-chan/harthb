package org.thingsboard.server.service.telemetry;

import org.springframework.context.ApplicationListener;
import org.thingsboard.rule.engine.api.RuleEngineTelemetryService;
import org.thingsboard.server.queue.discovery.PartitionChangeEvent;

/**
 * Created by ashvayka on 27.03.18.
 */
public interface TelemetrySubscriptionService extends InternalTelemetryService, ApplicationListener<PartitionChangeEvent> {

}
