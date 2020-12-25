package org.thingsboard.server.dao.sql.attributes;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.thingsboard.server.dao.util.PsqlDao;

@PsqlDao
@Repository
@Transactional
public class PsqlAttributesInsertRepository extends AttributeKvInsertRepository {

}