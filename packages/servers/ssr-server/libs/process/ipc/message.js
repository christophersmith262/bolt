const types = {
  SERVER_PROCESS_READY: 0x00,
  SERVER_START: 0x01,
  SERVER_AWAITING_ENVIRONMENTS: 0x02,
  SERVER_READY: 0x03,
  ENVIRONMENT_READY: 0x04,
  ENVIRONMENT_SHUTDOWN: 0x05,
  ENVIRONMENT_SHUTDOWN_ACK: 0x06,
  RENDER_REQUEST: 0x07,
  RENDER_RESPONSE: 0x08,
  INSTRUMENT_UPDATE: 0x09,
};

module.exports = {
  types,
};