package org.thingsboard.server.dao;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.thingsboard.server.dao.util.PsqlDao;
import org.thingsboard.server.dao.util.SqlTsOrTsLatestAnyDao;

@Configuration
@EnableAutoConfiguration
@EnableJpaRepositories({"org.thingsboard.server.dao.sqlts.dictionary"})
@EntityScan({"org.thingsboard.server.dao.model.sqlts.dictionary"})
@EnableTransactionManagement
@SqlTsOrTsLatestAnyDao
public class SqlTimeseriesDaoConfig {

}
