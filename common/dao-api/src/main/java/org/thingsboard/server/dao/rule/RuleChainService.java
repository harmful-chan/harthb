package org.thingsboard.server.dao.rule;

import com.google.common.util.concurrent.ListenableFuture;
import org.thingsboard.server.common.data.exception.ThingsboardException;
import org.thingsboard.server.common.data.id.RuleChainId;
import org.thingsboard.server.common.data.id.RuleNodeId;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.page.PageData;
import org.thingsboard.server.common.data.page.PageLink;
import org.thingsboard.server.common.data.relation.EntityRelation;
import org.thingsboard.server.common.data.rule.RuleChain;
import org.thingsboard.server.common.data.rule.RuleChainData;
import org.thingsboard.server.common.data.rule.RuleChainImportResult;
import org.thingsboard.server.common.data.rule.RuleChainMetaData;
import org.thingsboard.server.common.data.rule.RuleNode;

import java.util.List;

/**
 * Created by igor on 3/12/18.
 */
public interface RuleChainService {

    RuleChain saveRuleChain(RuleChain ruleChain);

    boolean setRootRuleChain(TenantId tenantId, RuleChainId ruleChainId);

    RuleChainMetaData saveRuleChainMetaData(TenantId tenantId, RuleChainMetaData ruleChainMetaData);

    RuleChainMetaData loadRuleChainMetaData(TenantId tenantId, RuleChainId ruleChainId);

    RuleChain findRuleChainById(TenantId tenantId, RuleChainId ruleChainId);

    RuleNode findRuleNodeById(TenantId tenantId, RuleNodeId ruleNodeId);

    ListenableFuture<RuleChain> findRuleChainByIdAsync(TenantId tenantId, RuleChainId ruleChainId);

    ListenableFuture<RuleNode> findRuleNodeByIdAsync(TenantId tenantId, RuleNodeId ruleNodeId);

    RuleChain getRootTenantRuleChain(TenantId tenantId);

    List<RuleNode> getRuleChainNodes(TenantId tenantId, RuleChainId ruleChainId);

    List<RuleNode> getReferencingRuleChainNodes(TenantId tenantId, RuleChainId ruleChainId);

    List<EntityRelation> getRuleNodeRelations(TenantId tenantId, RuleNodeId ruleNodeId);

    PageData<RuleChain> findTenantRuleChains(TenantId tenantId, PageLink pageLink);

    void deleteRuleChainById(TenantId tenantId, RuleChainId ruleChainId);

    void deleteRuleChainsByTenantId(TenantId tenantId);

    RuleChainData exportTenantRuleChains(TenantId tenantId, PageLink pageLink) throws ThingsboardException;

    List<RuleChainImportResult> importTenantRuleChains(TenantId tenantId, RuleChainData ruleChainData, boolean overwrite);

}
