package net.javaguides.egs.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileDownloadController {

    private static final String UPLOAD_DIR = "uploads/materials/";

   
    @GetMapping("/download/{filename}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        try {
            // Prevent directory traversal attacks
            if (filename.contains("..") || filename.contains("/")) {
                return ResponseEntity.badRequest().body("Invalid filename");
            }

            Path filePath = Paths.get(UPLOAD_DIR, filename);
            File file = filePath.toFile();

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            byte[] content = Files.readAllBytes(filePath);
            MediaType mediaType = getMediaType(filename);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(mediaType)
                    .contentLength(content.length)
                    .body(content);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Error downloading file: " + e.getMessage());
        }
    }

    private MediaType getMediaType(String filename) {
        String extension = getFileExtension(filename).toLowerCase();

        return switch (extension) {
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "doc" -> MediaType.valueOf("application/msword");
            case "docx" -> MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            case "xls" -> MediaType.valueOf("application/vnd.ms-excel");
            case "xlsx" -> MediaType.valueOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            case "ppt" -> MediaType.valueOf("application/vnd.ms-powerpoint");
            case "pptx" -> MediaType.valueOf("application/vnd.openxmlformats-officedocument.presentationml.presentation");
            case "txt", "log" -> MediaType.TEXT_PLAIN;
            case "zip" -> MediaType.valueOf("application/zip");
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png" -> MediaType.IMAGE_PNG;
            case "gif" -> MediaType.IMAGE_GIF;
            case "mp4" -> MediaType.valueOf("video/mp4");
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return (lastDot > 0) ? filename.substring(lastDot + 1) : "";
    }
}
