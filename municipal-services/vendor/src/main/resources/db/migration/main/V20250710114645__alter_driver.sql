ALTER TABLE eg_driver
ADD COLUMN vehicle_id character varying(256),
ADD COLUMN vendor_id character varying(256);

ALTER TABLE eg_driver_auditlog
ADD COLUMN vehicle_id character varying(256),
ADD COLUMN vendor_id character varying(256);