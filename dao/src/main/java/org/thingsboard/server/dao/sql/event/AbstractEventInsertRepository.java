package org.thingsboard.server.dao.sql.event;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.thingsboard.server.dao.model.sql.EventEntity;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

@Slf4j
public abstract class AbstractEventInsertRepository implements EventInsertRepository {

    @PersistenceContext
    protected EntityManager entityManager;

    @Autowired
    protected PlatformTransactionManager transactionManager;

    protected EventEntity saveAndGet(EventEntity entity, String insertOrUpdateOnPrimaryKeyConflict, String insertOrUpdateOnUniqueKeyConflict) {
        EventEntity eventEntity = null;
        TransactionStatus insertTransaction = getTransactionStatus(TransactionDefinition.PROPAGATION_REQUIRED);
        try {
            eventEntity = processSaveOrUpdate(entity, insertOrUpdateOnPrimaryKeyConflict);
            transactionManager.commit(insertTransaction);
        } catch (Throwable throwable) {
            transactionManager.rollback(insertTransaction);
            if (throwable.getCause() instanceof ConstraintViolationException) {
                log.trace("Insert request leaded in a violation of a defined integrity constraint {} for Entity with entityId {} and entityType {}", throwable.getMessage(), entity.getEventUid(), entity.getEventType());
                TransactionStatus transaction = getTransactionStatus(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
                try {
                    eventEntity = processSaveOrUpdate(entity, insertOrUpdateOnUniqueKeyConflict);
                } catch (Throwable th) {
                    log.trace("Could not execute the update statement for Entity with entityId {} and entityType {}", entity.getEventUid(), entity.getEventType());
                    transactionManager.rollback(transaction);
                }
                transactionManager.commit(transaction);
            } else {
                log.trace("Could not execute the insert statement for Entity with entityId {} and entityType {}", entity.getEventUid(), entity.getEventType());
            }
        }
        return eventEntity;
    }

    @Modifying
    protected abstract EventEntity doProcessSaveOrUpdate(EventEntity entity, String query);

    protected Query getQuery(EventEntity entity, String query) {
        return entityManager.createNativeQuery(query, EventEntity.class)
                .setParameter("id", entity.getUuid())
                .setParameter("created_time", entity.getCreatedTime())
                .setParameter("body", entity.getBody().toString())
                .setParameter("entity_id", entity.getEntityId())
                .setParameter("entity_type", entity.getEntityType().name())
                .setParameter("event_type", entity.getEventType())
                .setParameter("event_uid", entity.getEventUid())
                .setParameter("tenant_id", entity.getTenantId())
                .setParameter("ts", entity.getTs());
    }

    private EventEntity processSaveOrUpdate(EventEntity entity, String query) {
        return doProcessSaveOrUpdate(entity, query);
    }

    private TransactionStatus getTransactionStatus(int propagationRequired) {
        DefaultTransactionDefinition insertDefinition = new DefaultTransactionDefinition();
        insertDefinition.setPropagationBehavior(propagationRequired);
        return transactionManager.getTransaction(insertDefinition);
    }
}