package com.kerala.dhms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadPath;

    public FileStorageService(@Value("${app.upload-dir:./uploads}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
            String cleanFileName = System.currentTimeMillis() + "-" + originalFileName.replaceAll("[^a-zA-Z0-9._-]", "_");
            Path targetLocation = this.uploadPath.resolve(cleanFileName);
            Files.copy(file.getInputStream(), targetLocation);

            return "http://localhost:5000/uploads/" + cleanFileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    public Path getUploadPath() {
        return uploadPath;
    }
}
