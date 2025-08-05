ALTER TABLE eg_fsm_address
ADD COLUMN zone character varying(64),
ADD COLUMN ward character varying(64);


ALTER TABLE eg_fsm_address_auditlog
ADD COLUMN zone character varying(64),
ADD COLUMN ward character varying(64);