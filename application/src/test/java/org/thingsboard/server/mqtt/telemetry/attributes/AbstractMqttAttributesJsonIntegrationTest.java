package org.thingsboard.server.mqtt.telemetry.attributes;

import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.thingsboard.server.common.data.TransportPayloadType;

import java.util.Arrays;
import java.util.List;

@Slf4j
public abstract class AbstractMqttAttributesJsonIntegrationTest extends AbstractMqttAttributesIntegrationTest {

    private static final String POST_DATA_ATTRIBUTES_TOPIC = "data/attributes";

    @Before
    public void beforeTest() throws Exception {
        processBeforeTest("Test Post Attributes device", "Test Post Attributes gateway", TransportPayloadType.JSON, null, POST_DATA_ATTRIBUTES_TOPIC);
    }

    @After
    public void afterTest() throws Exception {
        processAfterTest();
    }

    @Test
    public void testPushMqttAttributes() throws Exception {
        List<String> expectedKeys = Arrays.asList("key1", "key2", "key3", "key4", "key5");
        processAttributesTest(POST_DATA_ATTRIBUTES_TOPIC, expectedKeys, PAYLOAD_VALUES_STR.getBytes());
    }

    @Test
    public void testPushMqttAttributesGateway() throws Exception {
        List<String> expectedKeys = Arrays.asList("key1", "key2", "key3", "key4", "key5");
        String deviceName1 = "Device A";
        String deviceName2 = "Device B";
        String payload = getGatewayAttributesJsonPayload(deviceName1, deviceName2);
        processGatewayAttributesTest(expectedKeys, payload.getBytes(), deviceName1, deviceName2);
    }
}
