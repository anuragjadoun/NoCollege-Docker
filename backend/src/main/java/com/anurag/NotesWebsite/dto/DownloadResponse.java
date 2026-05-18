package com.anurag.NotesWebsite.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DownloadResponse {

    private Long id;

    private String title;
    private String filePath;
    private LocalDateTime downloadedAt;
}