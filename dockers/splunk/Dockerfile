FROM splunk/splunk:latest

ARG SPLUNK_PASSWORD
ARG LOG_SPLUNK_TOKEN

# Accept EULA
ENV SPLUNK_START_ARGS --accept-license
ENV SPLUNK_LICENSE_URI Free

RUN echo "====== Bundle default configuration ======"
COPY default.yml /tmp/defaults/

# Change user to root
USER root

# Fill default.yml from env
RUN sed -i.bak -e "s/##SPLUNK_PASSWORD##/$SPLUNK_PASSWORD/g" -e "s/##LOG_SPLUNK_TOKEN##/$LOG_SPLUNK_TOKEN/g" /tmp/defaults/default.yml

# Change default.yml ownership
RUN chown splunk:splunk /tmp/defaults/default.yml

USER ansible
