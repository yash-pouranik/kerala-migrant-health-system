package com.kerala.dhms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kerala.dhms.entity.Patient;
import com.kerala.dhms.repository.PatientRepository;
import io.socket.engineio.server.EngineIoServer;
import io.socket.engineio.server.EngineIoServerOptions;
import io.socket.socketio.server.SocketIoNamespace;
import io.socket.socketio.server.SocketIoServer;
import io.socket.socketio.server.SocketIoSocket;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class SocketIOService {

    private final PatientRepository patientRepository;
    private final ObjectMapper objectMapper;
    private EngineIoServer engineIoServer;
    private SocketIoServer socketIoServer;
    private SocketIoNamespace mainNamespace;

    public SocketIOService(@Lazy PatientRepository patientRepository, ObjectMapper objectMapper) {
        this.patientRepository = patientRepository;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        EngineIoServerOptions eioOptions = EngineIoServerOptions.newFromDefault();
        eioOptions.setAllowedCorsOrigins(EngineIoServerOptions.ALLOWED_CORS_ORIGIN_ALL);

        this.engineIoServer = new EngineIoServer(eioOptions);
        this.socketIoServer = new SocketIoServer(this.engineIoServer);
        this.mainNamespace = this.socketIoServer.namespace("/");

        this.mainNamespace.on("connection", args -> {
            SocketIoSocket socket = (SocketIoSocket) args[0];
            log.info("Socket client connected: {}", socket.getId());

            socket.on("new_patient", patientArgs -> {
                try {
                    log.info("Received new_patient socket event: {}", patientArgs[0]);
                    JSONObject data = null;
                    if (patientArgs[0] instanceof JSONObject) {
                        data = (JSONObject) patientArgs[0];
                    } else if (patientArgs[0] != null) {
                        data = new JSONObject(patientArgs[0].toString());
                    }

                    if (data != null) {
                        String id = data.optString("id", "KDH-" + System.currentTimeMillis());
                        String name = data.optString("name", "Unknown");
                        int age = data.optInt("age", 25);
                        String gender = data.optString("gender", "Male");
                        String mobile = data.optString("mobile", "");
                        String abhaId = data.optString("abhaId", null);
                        String origin = data.optString("origin", "");
                        String district = data.optString("district", "Wayanad");
                        String housing = data.optString("housing", "Labour Camp");
                        int occupants = data.optInt("occupants", 4);

                        Patient patient = Patient.builder()
                                .patientId(id)
                                .fullName(name)
                                .age(age)
                                .gender(gender)
                                .mobile(mobile)
                                .abhaId(abhaId)
                                .originState(origin)
                                .currentLocation(district)
                                .accommodationType(housing)
                                .roomOccupancy(occupants)
                                .registeredAt(LocalDateTime.now())
                                .isActive(1)
                                .build();

                        patientRepository.save(patient);
                        log.info("Patient saved via socket: {}", patient.getPatientId());

                        broadcastHealthDataUpdate();
                    }
                } catch (Exception e) {
                    log.error("Error processing new_patient socket event", e);
                }
            });

            socket.on("disconnect", dcArgs -> {
                log.info("Socket client disconnected: {}", socket.getId());
            });
        });
    }

    public EngineIoServer getEngineIoServer() {
        return engineIoServer;
    }

    public void broadcast(String event, Object... args) {
        if (mainNamespace != null) {
            try {
                mainNamespace.broadcast((String) null, event, args);
            } catch (Exception e) {
                log.error("Error broadcasting socket event {}", event, e);
            }
        }
    }

    public void broadcastHealthDataUpdate() {
        broadcast("health_data_update");
    }

    public void broadcastVisitAdded(Long patientId, Object visit) {
        try {
            JSONObject payload = new JSONObject();
            payload.put("patientId", patientId);
            payload.put("visit", new JSONObject(objectMapper.writeValueAsString(visit)));
            broadcast("visit:added", payload);
            broadcastHealthDataUpdate();
        } catch (Exception e) {
            log.error("Error broadcasting visit:added", e);
        }
    }

    public void broadcastVaccinationUpdated(Long patientId, Long vaccineId) {
        try {
            JSONObject payload = new JSONObject();
            payload.put("patientId", patientId);
            payload.put("vaccineId", vaccineId);
            broadcast("vaccination:updated", payload);
            broadcastHealthDataUpdate();
        } catch (Exception e) {
            log.error("Error broadcasting vaccination:updated", e);
        }
    }

    @PreDestroy
    public void cleanup() {
        if (engineIoServer != null) {
            engineIoServer.shutdown();
        }
    }
}
