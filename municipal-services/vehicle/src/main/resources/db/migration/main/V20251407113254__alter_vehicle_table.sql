ALTER TABLE eg_vehicle
ADD COLUMN vendor_id character varying(256);

ALTER TABLE eg_vehicle_auditlog
ADD COLUMN vendor_id character varying(256);

ALTER TABLE eg_vehicle
ADD COLUMN vehicle_img character varying(128);

ALTER TABLE eg_vehicle_auditlog
ADD COLUMN vehicle_img character varying(128);