FROM thingsboard/openjdk8

COPY logback.xml ${pkg.name}.conf start-db.sh stop-db.sh start-tb.sh upgrade-tb.sh install-tb.sh ${pkg.name}.deb /tmp/

RUN chmod a+x /tmp/*.sh \
    && mv /tmp/start-tb.sh /usr/bin \
    && mv /tmp/upgrade-tb.sh /usr/bin \
    && mv /tmp/install-tb.sh /usr/bin \
    && mv /tmp/start-db.sh /usr/bin \
    && mv /tmp/stop-db.sh /usr/bin

RUN dpkg -i /tmp/${pkg.name}.deb
RUN rm /tmp/${pkg.name}.deb

RUN systemctl --no-reload disable --now ${pkg.name}.service > /dev/null 2>&1 || :

RUN mv /tmp/logback.xml ${pkg.installFolder}/conf \
    && mv /tmp/${pkg.name}.conf ${pkg.installFolder}/conf

ENV DATA_FOLDER=/data

ENV HTTP_BIND_PORT=9090
ENV DATABASE_TS_TYPE=sql

ENV SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.HSQLDialect
ENV SPRING_DRIVER_CLASS_NAME=org.hsqldb.jdbc.JDBCDriver
ENV SPRING_DATASOURCE_URL=jdbc:hsqldb:file:/data/db/thingsboardDb;sql.enforce_size=false;hsqldb.log_size=5
ENV SPRING_DATASOURCE_USERNAME=sa
ENV SPRING_DATASOURCE_PASSWORD=

RUN mkdir -p /data
RUN chown -R ${pkg.user}:${pkg.user} /data

RUN chmod 555 ${pkg.installFolder}/bin/${pkg.name}.jar

USER ${pkg.user}

EXPOSE 9090
EXPOSE 1883
EXPOSE 5683/udp

VOLUME ["/data"]

CMD ["start-tb.sh"]
