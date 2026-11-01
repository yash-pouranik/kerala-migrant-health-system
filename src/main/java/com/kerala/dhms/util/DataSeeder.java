package com.kerala.dhms.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kerala.dhms.entity.*;
import com.kerala.dhms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final PatientRepository patientRepository;
    private final HealthConditionRepository healthConditionRepository;
    private final VaccinationRepository vaccinationRepository;
    private final PatientVisitRepository patientVisitRepository;
    private final VisitAttachmentRepository visitAttachmentRepository;
    private final PatientSchemeRepository patientSchemeRepository;
    private final LabReportRepository labReportRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final ReferralRepository referralRepository;
    private final AbdmConsentRequestRepository abdmConsentRequestRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (patientRepository.count() > 0) {
            log.info("Database already seeded with {} patients.", patientRepository.count());
            return;
        }

        log.info("Starting initial DHMS demo data seeding...");

        String[] states = {"Bihar", "Jharkhand", "West Bengal", "Odisha", "Assam", "Uttar Pradesh", "Rajasthan"};
        Map<String, String[]> districtsMap = new HashMap<>() {{
            put("Bihar", new String[]{"Patna", "Gaya", "Bhagalpur"});
            put("Jharkhand", new String[]{"Ranchi", "Dhanbad", "Jamshedpur"});
            put("West Bengal", new String[]{"Kolkata", "Howrah", "Siliguri"});
            put("Odisha", new String[]{"Bhubaneswar", "Cuttack", "Rourkela"});
            put("Assam", new String[]{"Guwahati", "Dibrugarh", "Silchar"});
            put("Uttar Pradesh", new String[]{"Lucknow", "Kanpur", "Varanasi"});
            put("Rajasthan", new String[]{"Jaipur", "Jodhpur", "Udaipur"});
        }};

        String[] keralaDistricts = {
                "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
                "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
                "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
        };

        String[] accommodationTypes = {"Rented Shared Unit", "Employer Quarters", "Makeshift Shelter", "Labour Camps"};
        String[] toiletAccess = {"Personal", "Shared", "None"};
        String[] bloodGroups = {"A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"};

        String[] realisticNames = {
                "Imran Kumar", "Rajesh Kumar", "Suman Devi", "Amit Singh", "Priya Das", "Manoj Yadav",
                "Anita Murmu", "Subhash Chandra", "Gita Rani", "Vikram Meena", "Pooja Sharma",
                "Ramesh Soren", "Laxmi Kumari", "Sanjay Mahato", "Deepika Roy", "Suresh Ali",
                "Rina Khatun", "Mohammad Azad", "Sunita Bouri", "Arun Tudu", "Kabita Barua",
                "Bikram Singh", "Mousumi Begum", "Suraj Pal", "Nilam Devi"
        };

        Random random = new Random(42);

        for (int i = 0; i < 25; i++) {
            String name = realisticNames[i];
            String state = states[random.nextInt(states.length)];
            String[] stateDistricts = districtsMap.get(state);
            String originDistrict = stateDistricts[random.nextInt(stateDistricts.length)];
            String keralaDistrict = (i == 0) ? "Wayanad" : keralaDistricts[i % keralaDistricts.length];

            String patientIdStr = String.format("KDH-2025-%06d", 1234 + i);
            String abhaId = String.format("%02d-%04d-%04d-%04d",
                    random.nextInt(90) + 10,
                    random.nextInt(9000) + 1000,
                    random.nextInt(9000) + 1000,
                    random.nextInt(9000) + 1000
            );

            Patient patient = Patient.builder()
                    .patientId(patientIdStr)
                    .fullName(name)
                    .age(18 + random.nextInt(41))
                    .gender(random.nextDouble() > 0.4 ? "Male" : "Female")
                    .bloodGroup(bloodGroups[random.nextInt(bloodGroups.length)])
                    .originState(state)
                    .originDistrict(originDistrict)
                    .currentLocation(keralaDistrict)
                    .currentAddress("Building No. " + (random.nextInt(50) + 1) + ", Sector 4, " + keralaDistrict)
                    .accommodationType(accommodationTypes[random.nextInt(accommodationTypes.length)])
                    .roomOccupancy(random.nextInt(10) + 2)
                    .hasCleanWater(random.nextDouble() > 0.2 ? 1 : 0)
                    .toiletAccess(toiletAccess[random.nextInt(toiletAccess.length)])
                    .abhaId(abhaId)
                    .abdmLinked(1)
                    .abdmLinkedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .mobile("+91-" + (6000000000L + (long)(random.nextDouble() * 4000000000L)))
                    .emergencyContactName("Family Member")
                    .emergencyContactPhone("+91-9876543210")
                    .emergencyContactRelation("Spouse/Sibling")
                    .registeredAt(LocalDateTime.now().minusDays(random.nextInt(60)))
                    .isActive(1)
                    .build();

            Patient saved = patientRepository.save(patient);

            // Health Conditions
            if (i == 0) {
                healthConditionRepository.save(HealthCondition.builder()
                        .patientId(saved.getId())
                        .conditionName("Asthma")
                        .icdCode("J45")
                        .severity("Moderate")
                        .diagnosedDate(LocalDate.now().minusMonths(6))
                        .notes("Chronic asthma, needs inhaler during winter")
                        .isActive(1)
                        .build());
            } else {
                double r = random.nextDouble();
                if (r < 0.3) {
                    healthConditionRepository.save(HealthCondition.builder()
                            .patientId(saved.getId())
                            .conditionName("Asthma")
                            .icdCode("J45")
                            .severity("Mild")
                            .diagnosedDate(LocalDate.now().minusMonths(3))
                            .notes("Wheezing, seasonal triggers")
                            .isActive(1)
                            .build());
                } else if (r < 0.5) {
                    healthConditionRepository.save(HealthCondition.builder()
                            .patientId(saved.getId())
                            .conditionName("Hypertension")
                            .icdCode("I10")
                            .severity("Mild")
                            .diagnosedDate(LocalDate.now().minusMonths(2))
                            .notes("High blood pressure, monitoring required")
                            .isActive(1)
                            .build());
                } else if (r < 0.65) {
                    healthConditionRepository.save(HealthCondition.builder()
                            .patientId(saved.getId())
                            .conditionName("Diabetes Type 2")
                            .icdCode("E11")
                            .severity("Moderate")
                            .diagnosedDate(LocalDate.now().minusMonths(4))
                            .notes("Diet control advised")
                            .isActive(1)
                            .build());
                }
            }

            // Vaccinations
            String[] vaccines = {"COVID-19", "Hepatitis B", "Tetanus", "MMR", "Influenza"};
            for (int dose = 0; dose < vaccines.length; dose++) {
                String vName = vaccines[dose];
                boolean completed = random.nextDouble() < 0.65;
                vaccinationRepository.save(Vaccination.builder()
                        .patientId(saved.getId())
                        .vaccineName(vName)
                        .doseNumber(dose + 1)
                        .status(completed ? "Completed" : "Pending")
                        .administeredDate(completed ? LocalDate.now().minusDays(random.nextInt(120) + 15) : null)
                        .nextDueDate(completed ? null : LocalDate.now().plusDays(random.nextInt(30) + 5))
                        .batchNumber(completed ? "VAC-" + (1000 + random.nextInt(9000)) : null)
                        .administratorName(completed ? "Nurse Anjali" : null)
                        .build());
            }

            // Visits
            if (i == 0 || random.nextDouble() > 0.4) {
                Map<String, Object> vitals = new HashMap<>();
                vitals.put("bloodPressure", (110 + random.nextInt(30)) + "/" + (70 + random.nextInt(20)));
                vitals.put("heartRate", 68 + random.nextInt(25));
                vitals.put("temperature", 98.4 + (random.nextInt(20) / 10.0));
                vitals.put("spo2", 97 + random.nextInt(3));

                PatientVisit visit = PatientVisit.builder()
                        .patientId(saved.getId())
                        .visitDate(LocalDateTime.now().minusDays(random.nextInt(25) + 1))
                        .facility("PHC " + keralaDistrict)
                        .chiefComplaint(i == 0 ? "Seasonal cough and breathlessness" : "General fever and joint pain")
                        .vitals(objectMapper.writeValueAsString(vitals))
                        .diagnosis("Upper Respiratory Tract Infection")
                        .treatmentNotes("Prescribed antibiotics and oral hydration. Rest advised for 3 days.")
                        .followUpRequired(random.nextDouble() > 0.5 ? 1 : 0)
                        .followUpDate(LocalDate.now().plusDays(7).toString())
                        .createdAt(LocalDateTime.now())
                        .build();

                patientVisitRepository.save(visit);
            }

            // Schemes
            patientSchemeRepository.save(PatientScheme.builder()
                    .patientId(saved.getId())
                    .schemeName("Kerala Awaz Health Insurance")
                    .enrollmentStatus("ACTIVE")
                    .policyId("KA-" + (10000 + random.nextInt(90000)))
                    .coverageAmount(500000.0)
                    .validUntil(LocalDate.of(2027, 12, 31))
                    .claimsUsed(0.0)
                    .build());

            // Lab Reports
            labReportRepository.save(LabReport.builder()
                    .patientId(saved.getId())
                    .testName("Complete Blood Count (CBC)")
                    .testDate(LocalDate.now().minusDays(random.nextInt(45) + 5))
                    .result("Normal")
                    .referenceRange("Hb: 13-17 g/dL, WBC: 4000-11000")
                    .status("Final")
                    .facility("District Lab " + keralaDistrict)
                    .build());

            // Prescriptions
            prescriptionRepository.save(Prescription.builder()
                    .patientId(saved.getId())
                    .medicineName("Paracetamol 500mg")
                    .dosage("1 tablet")
                    .frequency("TDS (Thrice daily)")
                    .duration("5 days")
                    .instructions("After meals")
                    .prescribedDate(LocalDate.now().minusDays(random.nextInt(20) + 1))
                    .build());

            // Referrals
            if (random.nextDouble() > 0.7) {
                referralRepository.save(Referral.builder()
                        .patientId(saved.getId())
                        .toFacility("Government Medical College, " + keralaDistrict)
                        .reason("Specialist consultation")
                        .priority("Routine")
                        .status("Pending")
                        .referralDate(LocalDate.now().minusDays(random.nextInt(10) + 1))
                        .build());
            }

            // ABDM Consent
            abdmConsentRequestRepository.save(AbdmConsentRequest.builder()
                    .patientId(saved.getId())
                    .requesterFacilityId("KL-FAC-" + (100 + random.nextInt(900)))
                    .purpose("Care Management")
                    .dataTypes("[\"DiagnosticReport\",\"Prescription\",\"OPConsultation\"]")
                    .status("GRANTED")
                    .validFrom(LocalDate.now().minusMonths(1))
                    .validUntil(LocalDate.now().plusMonths(11))
                    .consentId(UUID.randomUUID().toString())
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        log.info("DHMS demo data seeding complete. 25 patients with clinical records created.");
    }
}
