ALTER TABLE eg_fsm_application
ADD COLUMN driver_id character varying(64);


ALTER TABLE eg_fsm_application_auditlog
ADD COLUMN driver_id character varying(64);