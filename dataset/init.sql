-- Insert data into Users
INSERT INTO users (id, first_name, last_name, phone, email, email_verified, secret_code, password, google_id, avatar_key, role)
VALUES 
('054c83d7-5a75-4867-8947-85d5ed482f63', 'John', 'Doe', '1234567890', 'john.doe@example.com', true, '12345', '$2b$10$gs9ffR.1rS2qVF.2fGXVG.38kGGz1/C.tlrljAcGeMVAJzWiH7tci', 'google-id-123', '1', 'DOCTOR'),
('f4e77c9c-0f7f-4a56-b2d7-c76a37c01e40', 'Jane', 'Smith', '0987654321', 'jane.smith@example.com', true, null, '$2b$10$gs9ffR.1rS2qVF.2fGXVG.38kGGz1/C.tlrljAcGeMVAJzWiH7tci', 'google-id-123', '123', 'PATIENT');

-- Insert data into Doctors
INSERT INTO doctors (id, user_id, payrate, about, rating)
VALUES 
('5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9', '054c83d7-5a75-4867-8947-85d5ed482f63', 500, 'Specialist in dermatology.', 4.7);

-- Insert data into Patients
INSERT INTO patients (id, user_id, weight, height, age, blood_type, gender, identity_card_key, country, state, city, street, apartment, zip_code, email_notification_toggle, request_bill_payment_approval, two_factor_auth_toggle)
VALUES 
('0c9451e9-c4a4-4a3d-a087-09d6d9ad8b37', 'f4e77c9c-0f7f-4a56-b2d7-c76a37c01e40', 70, 180, 28, 'O_PLUS', 'MALE', 'id1234567', 'USA', 'CA', 'Los Angeles', '123 Elm St', 'Apt 5', 90001, false, false, false);

-- Insert data into Hospitals
INSERT INTO hospitals (id, name, country, state, city, street, zip_code)
VALUES 
('4c9a25f6-c272-41e9-b9d6-2d15d0de8fcd', 'General Hospital', 'USA', 'CA', 'Los Angeles', '321 Cedar St', 90002);

-- Insert data into HospitalDoctors
INSERT INTO hospital_doctors (id, hospital_id, doctor_id)
VALUES 
('b7c3243f-7b52-4d25-bc7f-67d48b0385fe', '4c9a25f6-c272-41e9-b9d6-2d15d0de8fcd', '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9');

-- Insert data into Appointments
INSERT INTO appointments (id, patient_id, doctor_id, created_at, status, notes, started_at, price)
VALUES 
('01650e8f-9b7a-4d9a-b7de-25d5c5a92a75', '0c9451e9-c4a4-4a3d-a087-09d6d9ad8b37', '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9', '2024-05-01 14:00:00+00', 'PLANNED', 'Initial consultation for skin checkup.','2024-05-01 14:00:00+00', 10),
('3077c5f3-7077-4fba-8816-8dd594b66fe5', '0c9451e9-c4a4-4a3d-a087-09d6d9ad8b37', '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9', '2024-05-01 14:00:00+00', 'PENDING_PAYMENT', 'Initial consultation for skin checkup.','2024-05-03 20:00:00+00', 10),
('0d7ec0cb-d13f-4688-b8da-6a98df310559', '0c9451e9-c4a4-4a3d-a087-09d6d9ad8b37', '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9', '2024-05-01 14:00:00+00', 'CANCELED', 'Initial consultation for skin checkup.','2024-05-10 14:00:00+00', 10);

-- Insert data into Reviews
INSERT INTO reviews (id, text, rate, doctor_id, patient_id, created_at, updated_at)
VALUES 
('fa53b68a-5787-4f8e-b7ef-89eae8fbf89f', 'Very professional and friendly.', 5, '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9', '0c9451e9-c4a4-4a3d-a087-09d6d9ad8b37', '2024-05-01 16:30:00+00', '2024-05-01 16:30:00+00');

-- Insert data into Specializations
INSERT INTO specializations (id, name)
VALUES 
('27fa732b-abc8-4f49-af1e-2f1db3f7abaf', 'Dermatology'),
('e83c7e58-8c0e-4d2c-8836-b6a661b5c8cc', 'Cardiology');

-- Insert data into DoctorSpecializations (associating doctors with specializations)
INSERT INTO doctor_specializations (id, doctor_id, specialization_id)
VALUES 
('323f957e-b3ad-48a8-924a-1e6c6f6fec1d', '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9', '27fa732b-abc8-4f49-af1e-2f1db3f7abaf'),
('f47b4b5b-045a-4b8b-961e-c6e3c1f8df5f', '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9', 'e83c7e58-8c0e-4d2c-8836-b6a661b5c8cc');

-- Insert data into Declarations
INSERT INTO declarations (id, patient_id, doctor_id)
VALUES 
('67676767', '0c9451e9-c4a4-4a3d-a087-09d6d9ad8b37', '5ae9d6a1-82a1-4af8-b878-9661f0b8c6a9');
