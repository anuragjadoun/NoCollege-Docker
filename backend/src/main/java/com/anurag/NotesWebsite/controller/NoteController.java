package com.anurag.NotesWebsite.controller;

import com.anurag.NotesWebsite.dto.DownloadResponse;
import com.anurag.NotesWebsite.entity.Comment;
import com.anurag.NotesWebsite.entity.Feedback;
import com.anurag.NotesWebsite.entity.Note;
import com.anurag.NotesWebsite.entity.User;
import com.anurag.NotesWebsite.repository.DownloadRepository;
import com.anurag.NotesWebsite.security.JwtUtil;
import com.anurag.NotesWebsite.service.NoteService;
import com.anurag.NotesWebsite.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private DownloadRepository downloadRepository;

    // Create Note
    @PostMapping("/create")
    public Note createNote(@RequestBody Note note){
        return noteService.createNote(note);
    }

    @GetMapping("/my")
    public List<Note> getMyNotes(HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        return noteService.getMyNotes(email);
    }

    // GLOBAL FEED (sab users ko dikhega)
    @GetMapping("/all")
    public List<Note> getAllNotes(){
        return noteService.getAllNotes();
    }


    @GetMapping("/trending")
    public List<Note> getTrendingNotes() {

        return noteService
                .getTrendingNotes();
    }

    // Get Note by ID
    @GetMapping("/{id}")
    public Optional<Note> getNoteById(@PathVariable Long id){
        return noteService.getNoteById(id);
    }

    // Delete Note
    @DeleteMapping("/delete/{id}")
    public String deleteNote(@PathVariable Long id){
        noteService.deleteNote(id);
        return "Note deleted successfully";
    }

    // Search Notes
    @GetMapping("/search")
    public List<Note> searchNotes(@RequestParam String keyword){
        return noteService.searchNotes(keyword);
    }

    // UPDATED UPLOAD (USER LINKED)
    @PostMapping("/upload")
    public Note uploadNote(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            HttpServletRequest request
    ) throws Exception {

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        String filePath = "uploads/" + fileName;

        java.nio.file.Files.copy(
                file.getInputStream(),
                java.nio.file.Paths.get(filePath),
                java.nio.file.StandardCopyOption.REPLACE_EXISTING
        );

        // GET USER FROM TOKEN
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        // TEMP BAN CHECK

        if (

                Boolean.TRUE.equals(user.getBanned())

                        &&

                        user.getBanExpiry() != null

                        &&

                        user.getBanExpiry()
                                .isAfter(LocalDateTime.now())
        ) {

            throw new RuntimeException(
                    "You are temporarily banned ⛔"
            );
        }

        // SAVE NOTE WITH USER
        Note note = new Note();
        note.setTitle(title);
        note.setDescription(description);
        note.setFilePath(filePath);
        note.setUser(user);   // VERY IMPORTANT

        return noteService.createNote(note);
    }

    // Download

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable Long id,
            HttpServletRequest request
    ) {

        try {

            // NOTE FIND
            Note note = noteService.getNoteById(id)
                    .orElseThrow(() -> new RuntimeException("Note not found"));

            // TOKEN
            String token = request.getHeader("Authorization").substring(7);

            String email = jwtUtil.extractEmail(token);

            // SAVE DOWNLOAD HISTORY
            noteService.saveDownload(email, id);

            // FILE
            Path path = Paths.get(note.getFilePath());

            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("File not found");
            }

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + path.getFileName().toString() + "\""
                    )
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException("Download failed ❌");
        }
    }

    // Download history
    @GetMapping("/downloads")
    public List<DownloadResponse> getMyDownloads(HttpServletRequest request){

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        return noteService.getDownloadsByUser(email);
    }


    @PostMapping("/like/{id}")
    public String toggleLike(@PathVariable Long id, HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        boolean liked = noteService.toggleLike(email, id);

        return liked ? "Liked" : "Unliked";
    }

    @GetMapping("/likes/{id}")
    public long getLikes(@PathVariable Long id) {
        return noteService.getLikeCount(id);
    }

    @PostMapping("/comment/{id}")
    public String addComment(@PathVariable Long id,
                             @RequestBody String text,
                             HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        noteService.addComment(email, id, text);

        return "Comment added";
    }

    @GetMapping("/comments/{id}")
    public List<Comment> getComments(@PathVariable Long id) {
        return noteService.getComments(id);
    }


    // DELETE COMMENT

    @DeleteMapping("/comment/delete/{commentId}")
    public String deleteComment(
            @PathVariable Long commentId,
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization")
                        .substring(7);

        String email =
                jwtUtil.extractEmail(token);

        noteService.deleteComment(
                commentId,
                email
        );

        return "Comment deleted successfully";
    }

    // EDIT COMMENT

    @PutMapping("/comment/edit/{commentId}")
    public String editComment(
            @PathVariable Long commentId,
            @RequestBody String newText,
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization")
                        .substring(7);

        String email =
                jwtUtil.extractEmail(token);

        noteService.editComment(
                commentId,
                email,
                newText
        );

        return "Comment updated successfully";
    }


    @PostMapping("/feedback")
    public String sendFeedback(@RequestBody String message,
                               HttpServletRequest request) {

        String token = request.getHeader("Authorization").substring(7);
        String email = jwtUtil.extractEmail(token);

        noteService.saveFeedback(email, message);

        return "Feedback received ";
    }

    @GetMapping("/feedback/all")
    public List<Feedback> getAllFeedback(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized ❌");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        // ADMIN CHECK (CHANGE EMAIL HERE)
        if (!email.equals("anuragjadoun024@gmail.com")) {
            throw new RuntimeException("Access Denied ❌");
        }

        return noteService.getAllFeedback();
    }

    @DeleteMapping("/downloads/{id}")
    public ResponseEntity<?> deleteDownload(@PathVariable Long id) {

        downloadRepository.deleteById(id);

        return ResponseEntity.ok("Deleted successfully");
    }
}