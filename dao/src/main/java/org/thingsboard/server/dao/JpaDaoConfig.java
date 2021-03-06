package org.thingsboard.server.dao;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author Valerii Sosliuk
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan("org.thingsboard.server.dao.sql")
@EnableJpaRepositories("org.thingsboard.server.dao.sql")
@EntityScan("org.thingsboard.server.dao.model.sql")
@EnableTransactionManagement
public class JpaDaoConfig {

}
