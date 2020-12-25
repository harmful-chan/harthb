package org.thingsboard.server.common.data;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.thingsboard.server.common.data.id.EntityId;
import org.thingsboard.server.common.data.id.EntityIdFactory;
import org.thingsboard.server.common.data.id.HasId;

import java.util.UUID;

@Data
public class EntityInfo implements HasId<EntityId>, HasName {

    private final EntityId id;
    private final String name;

    @JsonCreator
    public EntityInfo(@JsonProperty("id") EntityId id, @JsonProperty("name") String name) {
        this.id = id;
        this.name = name;
    }

    public EntityInfo(UUID uuid, String entityType, String name) {
        this.id = EntityIdFactory.getByTypeAndUuid(entityType, uuid);
        this.name = name;
    }

}
