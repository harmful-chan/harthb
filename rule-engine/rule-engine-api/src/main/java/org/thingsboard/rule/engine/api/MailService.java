package org.thingsboard.rule.engine.api;

import com.fasterxml.jackson.databind.JsonNode;
import org.thingsboard.server.common.data.ApiFeature;
import org.thingsboard.server.common.data.ApiUsageStateMailMessage;
import org.thingsboard.server.common.data.ApiUsageStateValue;
import org.thingsboard.server.common.data.exception.ThingsboardException;
import org.thingsboard.server.common.data.id.TenantId;

import javax.mail.MessagingException;

public interface MailService {

    void updateMailConfiguration();

    void sendEmail(TenantId tenantId, String email, String subject, String message) throws ThingsboardException;
    
    void sendTestMail(JsonNode config, String email) throws ThingsboardException;
    
    void sendActivationEmail(String activationLink, String email) throws ThingsboardException;
    
    void sendAccountActivatedEmail(String loginLink, String email) throws ThingsboardException;
    
    void sendResetPasswordEmail(String passwordResetLink, String email) throws ThingsboardException;
    
    void sendPasswordWasResetEmail(String loginLink, String email) throws ThingsboardException;

    void send(TenantId tenantId, String from, String to, String cc, String bcc, String subject, String body) throws MessagingException;

    void sendAccountLockoutEmail( String lockoutEmail, String email, Integer maxFailedLoginAttempts) throws ThingsboardException;

    void sendApiFeatureStateEmail(ApiFeature apiFeature, ApiUsageStateValue stateValue, String email, ApiUsageStateMailMessage msg) throws ThingsboardException;
}
